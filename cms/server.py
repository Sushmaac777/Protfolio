"""Local password-protected admin. The generated public site stays static."""
from __future__ import annotations

import argparse
import base64
from collections import defaultdict
import hashlib
import hmac
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import secrets
import threading
import time
from urllib.parse import unquote, urlsplit

from build import ROOT, ContentError, atomic_write, render_site, write_site

SESSION_SECONDS = 8 * 60 * 60
PASSWORD_ITERATIONS = 600_000
MAX_BODY = 8_000_000


def password_record(password):
    if not isinstance(password, str) or not 12 <= len(password) <= 256:
        raise ContentError("Use a password between 12 and 256 characters.")
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), PASSWORD_ITERATIONS)
    return {"salt": salt, "digest": digest.hex(), "iterations": PASSWORD_ITERATIONS}


def check_password(password, account):
    if not isinstance(password, str) or len(password) > 256:
        return False
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(account["salt"]), account["iterations"])
    return hmac.compare_digest(digest.hex(), account["digest"])


class PortfolioServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, address, root=ROOT):
        self.root = Path(root).resolve()
        self.private = self.root / ".local-admin"
        self.private.mkdir(mode=0o700, exist_ok=True)
        os.chmod(self.private, 0o700)
        self.account_path = self.private / "account.json"
        self.content_path = self.root / "cms/site.json"
        self.lock = threading.RLock()
        self.sessions = {}
        self.attempts = defaultdict(list)
        self.setup_token = secrets.token_urlsafe(32)
        super().__init__(address, Handler)

    def account(self):
        return json.loads(self.account_path.read_text()) if self.account_path.exists() else None

    def revision(self):
        return hashlib.sha256(self.content_path.read_bytes()).hexdigest()

    def new_session(self, username):
        now = time.time()
        self.sessions = {key: value for key, value in self.sessions.items() if value["expires"] > now}
        token = secrets.token_urlsafe(48)
        session = {"username": username, "csrf": secrets.token_urlsafe(32), "expires": now + SESSION_SECONDS}
        self.sessions[token] = session
        return token, session


class Handler(SimpleHTTPRequestHandler):
    server: PortfolioServer

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(args[2].root), **kwargs)

    def log_message(self, fmt, *args):
        # Never log credentials, bodies, or request URLs/query strings.
        if len(args) >= 2:
            print(f"HTTP {args[1]}", flush=True)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Cache-Control", "no-store")
        if urlsplit(self.path).path.startswith("/admin"):
            self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://api.github.com; img-src 'self' https: data: blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'")
        super().end_headers()

    def valid_host(self):
        port = self.server.server_port
        return self.headers.get("Host") in (f"localhost:{port}", f"127.0.0.1:{port}")

    def json_response(self, code, data, cookie=None):
        payload = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(payload)

    def session(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
        except Exception:
            return None, None
        token = cookie.get("portfolio_admin")
        key = token.value if token else ""
        session = self.server.sessions.get(key)
        if not session or session["expires"] < time.time():
            self.server.sessions.pop(key, None)
            return None, None
        return key, session

    def signed_in(self):
        token, session = self.session()
        if not session:
            self.json_response(401, {"error": "Please log in again."})
            return None
        return token, session

    def mutation_allowed(self):
        origin = self.headers.get("Origin")
        if not self.valid_host() or origin not in (
            f"http://localhost:{self.server.server_port}",
            f"http://127.0.0.1:{self.server.server_port}",
        ) or self.headers.get("X-Portfolio-Admin") != "1":
            self.json_response(403, {"error": "This request must come from the local admin page."})
            return False
        if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
            self.json_response(415, {"error": "Use a JSON request."})
            return False
        return True

    def payload(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= MAX_BODY:
                raise ValueError()
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError()
            return data
        except (ValueError, UnicodeError):
            raise ContentError("The request is missing, invalid, or too large.")

    def do_GET(self):
        if not self.valid_host():
            return self.json_response(403, {"error": "Host not allowed."})
        path = urlsplit(self.path).path
        if path == "/api/admin/session":
            _, session = self.session()
            result = {"authenticated": bool(session), "setup_required": self.server.account() is None}
            if session:
                result.update(username=session["username"], csrf=session["csrf"])
            elif result["setup_required"]:
                result["setup_token"] = self.server.setup_token
            return self.json_response(200, result)
        if path == "/api/admin/content":
            if not self.signed_in():
                return
            with self.server.lock:
                return self.json_response(200, {"content": json.loads(self.server.content_path.read_text()), "revision": self.server.revision()})
        return self.serve_public()

    def do_HEAD(self):
        if not self.valid_host():
            return self.send_error(403)
        return self.serve_public(head=True)

    def serve_public(self, head=False):
        path = unquote(urlsplit(self.path).path)
        if "\x00" in path or "\\" in path or any(part.startswith(".") or part.startswith("_") for part in path.split("/") if part):
            return self.send_error(404)
        first = path.strip("/").split("/")[0]
        if first in ["cms", "api", "tests", "docs"] or path.endswith((".py", ".md", ".yml", ".txt")):
            return self.send_error(404)
        resolved = (self.server.root / path.lstrip("/")).resolve()
        if not resolved.is_relative_to(self.server.root):
            return self.send_error(404)
        if resolved.is_dir() and not (resolved / "index.html").exists():
            return self.send_error(404)
        if resolved.suffix == ".json" and path not in ["/admin/schema.json", "/admin/config.json"]:
            return self.send_error(404)
        return super().do_HEAD() if head else super().do_GET()

    def do_POST(self):
        if not self.mutation_allowed():
            return
        try:
            payload = self.payload()
            with self.server.lock:
                return self.handle_mutation(urlsplit(self.path).path, payload)
        except ContentError as error:
            return self.json_response(400, {"error": str(error)})
        except (OSError, ValueError, KeyError):
            return self.json_response(500, {"error": "The update could not be completed. Your saved content is still available; check the local server."})

    def handle_mutation(self, path, payload):
        if path in ["/api/admin/setup", "/api/admin/login"]:
            return self.login_or_setup(path, payload)
        signed = self.signed_in()
        if not signed:
            return
        token, session = signed
        if not hmac.compare_digest(self.headers.get("X-CSRF-Token", "").encode(), session["csrf"].encode()):
            return self.json_response(403, {"error": "Your session needs to be refreshed before saving."})
        if path == "/api/admin/logout":
            self.server.sessions.pop(token, None)
            return self.json_response(200, {"ok": True}, "portfolio_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0")
        if path == "/api/admin/password":
            account = self.server.account()
            if not check_password(payload.get("current_password"), account):
                return self.json_response(401, {"error": "The current password is incorrect."})
            record = password_record(payload.get("new_password"))
            record["username"] = account["username"]
            atomic_write(self.server.account_path, json.dumps(record), 0o600)
            self.server.sessions.clear()
            return self.json_response(200, {"ok": True}, "portfolio_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0")
        if path == "/api/admin/upload":
            return self.upload(payload)
        if path != "/api/admin/content":
            return self.json_response(404, {"error": "Unknown admin action."})
        if not hmac.compare_digest(str(payload.get("revision", "")).encode(), self.server.revision().encode()):
            return self.json_response(409, {"error": "Content changed in another session. Export your unsaved changes, then reload before saving."})
        content = payload.get("content")
        output = render_site(content)  # Validate and fully render before modifying any saved file.
        old = self.server.content_path.read_text()
        saved = json.dumps(content, ensure_ascii=False, indent=2) + "\n"
        atomic_write(self.server.private / "previous-content.json", old, 0o600)
        atomic_write(self.server.content_path, saved)
        try:
            write_site(output, self.server.root)
        except OSError:
            atomic_write(self.server.content_path, old)
            write_site(render_site(json.loads(old)), self.server.root)
            raise
        return self.json_response(200, {"ok": True, "revision": self.server.revision(), "message": "Saved. The local website has been updated."})

    def login_or_setup(self, path, payload):
        now = time.time()
        ip = self.client_address[0]
        self.server.attempts[ip] = [stamp for stamp in self.server.attempts[ip] if stamp > now - 300]
        if len(self.server.attempts[ip]) >= 5:
            return self.json_response(429, {"error": "Too many attempts. Wait five minutes before trying again."})
        account = self.server.account()
        if path.endswith("/setup"):
            if account is not None:
                return self.json_response(409, {"error": "An account already exists. Please log in."})
            if not hmac.compare_digest(str(payload.get("setup_token", "")).encode(), self.server.setup_token.encode()):
                return self.json_response(403, {"error": "Reload this page before creating the account."})
            username = payload.get("username", "")
            if not isinstance(username, str) or not 3 <= len(username.strip()) <= 60:
                raise ContentError("Use a username between 3 and 60 characters.")
            account = password_record(payload.get("password"))
            account["username"] = username.strip()
            atomic_write(self.server.account_path, json.dumps(account), 0o600)
        else:
            password = payload.get("password", "")
            valid = check_password(password, account) if account else False
            valid = valid and hmac.compare_digest(str(payload.get("username", "")).encode(), account["username"].encode())
            if not valid:
                self.server.attempts[ip].append(now)
                return self.json_response(401, {"error": "Incorrect username or password."})
        self.server.attempts[ip] = []
        token, session = self.server.new_session(account["username"])
        return self.json_response(200, {"authenticated": True, "username": session["username"], "csrf": session["csrf"]},
            f"portfolio_admin={token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age={SESSION_SECONDS}")

    def upload(self, payload):
        try:
            raw = base64.b64decode(payload.get("data", ""), validate=True)
        except (ValueError, TypeError):
            raise ContentError("The image could not be read.")
        if not 0 < len(raw) <= 5_000_000:
            raise ContentError("Images must be smaller than 5 MB.")
        if raw.startswith(b"\x89PNG\r\n\x1a\n"):
            extension = ".png"
        elif raw.startswith(b"\xff\xd8\xff"):
            extension = ".jpg"
        elif raw.startswith(b"RIFF") and raw[8:12] == b"WEBP":
            extension = ".webp"
        else:
            raise ContentError("Choose a PNG, JPEG, or WebP image.")
        relative = "assets/uploads/" + secrets.token_hex(16) + extension
        target = self.server.root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("xb") as out:
            out.write(raw)
        return self.json_response(200, {"path": relative})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reset-password", action="store_true")
    args = parser.parse_args()
    if args.reset_password:
        import getpass
        path = ROOT / ".local-admin/account.json"
        if not path.exists():
            raise SystemExit("No account exists yet. Start the server and open /admin/.")
        account = json.loads(path.read_text())
        password = getpass.getpass("New password (at least 12 characters): ")
        if password != getpass.getpass("Repeat new password: "):
            raise SystemExit("Passwords did not match.")
        record = password_record(password)
        record["username"] = account["username"]
        atomic_write(path, json.dumps(record), 0o600)
        print("Password updated. Restart the admin server to invalidate existing sessions.")
        return
    write_site(render_site(json.loads((ROOT / "cms/site.json").read_text())))
    server = PortfolioServer(("127.0.0.1", args.port))
    print(f"Website: http://localhost:{args.port}\nAdmin:   http://localhost:{args.port}/admin/\nLocal access only. Create your account in the browser.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
