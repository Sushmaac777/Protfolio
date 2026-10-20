"""Exercise real HTTP authentication, content persistence, and static output."""
import base64
from copy import deepcopy
import http.client
import json
from pathlib import Path
import stat
import tempfile
import threading
import unittest
from unittest.mock import patch

from build import ROOT, ContentError, render_site, write_site
from server import Handler, PortfolioServer


class AdminTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = json.loads((ROOT / "cms/site.json").read_text())

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "cms").mkdir()
        (self.root / "cms/site.json").write_text(json.dumps(self.original))
        write_site(render_site(self.original), self.root)
        self.logs = patch.object(Handler, "log_message", lambda *args: None)
        self.logs.start()
        self.server = PortfolioServer(("127.0.0.1", 0), self.root)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.cookie = ""
        self.csrf = ""

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.logs.stop()
        self.temp.cleanup()

    def request(self, path, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        defaults = {"Cookie": self.cookie}
        if body is not None:
            defaults.update({
                "Origin": f"http://127.0.0.1:{self.server.server_port}",
                "Content-Type": "application/json", "X-Portfolio-Admin": "1",
                "X-CSRF-Token": self.csrf,
            })
        defaults.update(headers or {})
        connection.request("POST" if body is not None else "GET", path,
                           json.dumps(body) if body is not None else None, defaults)
        response = connection.getresponse()
        data = response.read()
        status = response.status
        response_headers = dict(response.getheaders())
        if "Set-Cookie" in response_headers:
            self.cookie = response_headers["Set-Cookie"].split(";")[0]
        if "application/json" in response_headers.get("Content-Type", ""):
            data = json.loads(data)
        connection.close()
        return status, data, response_headers

    def setup_account(self):
        status, session, _ = self.request("/api/admin/session")
        self.assertEqual(status, 200)
        self.assertTrue(session["setup_required"])
        status, result, headers = self.request("/api/admin/setup", {
            "username": "test-owner", "password": "Test-only-password-123",
            "setup_token": session["setup_token"],
        })
        self.assertEqual(status, 200)
        self.csrf = result["csrf"]
        self.assertIn("HttpOnly", headers["Set-Cookie"])
        self.assertIn("SameSite=Strict", headers["Set-Cookie"])

    def save(self, content, revision=None):
        if revision is None:
            status, result, _ = self.request("/api/admin/content")
            self.assertEqual(status, 200)
            revision = result["revision"]
        return self.request("/api/admin/content", {"content": content, "revision": revision})

    def test_login_access_control_and_password_change(self):
        self.assertEqual(self.request("/api/admin/content")[0], 401)
        self.assertEqual(self.request("/api/admin/session", headers={"Host": "evil.test"})[0], 403)
        self.assertEqual(self.request("/api/admin/setup", {}, {"Origin": "https://evil.test"})[0], 403)
        self.assertEqual(self.request("/api/admin/setup", {})[0], 403)
        self.setup_account()
        account_path = self.root / ".local-admin/account.json"
        self.assertNotIn("Test-only-password-123", account_path.read_text())
        self.assertEqual(stat.S_IMODE(account_path.stat().st_mode), 0o600)
        for path in ["/.local-admin/account.json", "/cms/site.json", "/%2e%2e/README.md", "/_legacy/", "/cms/server.py"]:
            self.assertEqual(self.request(path)[0], 404, path)
        self.assertEqual(self.request("/api/admin/logout", {}, {"X-CSRF-Token": "bad"})[0], 403)
        self.assertEqual(self.request("/api/admin/password", {"current_password": "wrong", "new_password": "New-password-12345"})[0], 401)
        self.assertEqual(self.request("/api/admin/password", {"current_password": "Test-only-password-123", "new_password": "New-password-12345"})[0], 200)
        self.assertEqual(self.request("/api/admin/content")[0], 401)
        self.assertEqual(self.request("/api/admin/login", {"username": "test-owner", "password": "Test-only-password-123"})[0], 401)
        status, result, _ = self.request("/api/admin/login", {"username": "test-owner", "password": "New-password-12345"})
        self.assertEqual(status, 200)
        self.csrf = result["csrf"]
        self.assertEqual(self.request("/api/admin/logout", {})[0], 200)
        self.assertFalse(self.request("/api/admin/session")[1]["authenticated"])

    def test_login_rate_limit(self):
        self.setup_account()
        for _ in range(5):
            self.assertEqual(self.request("/api/admin/login", {"username": "test-owner", "password": "wrong"})[0], 401)
        self.assertEqual(self.request("/api/admin/login", {"username": "test-owner", "password": "Test-only-password-123"})[0], 429)

    def test_unicode_username_and_account_persistence(self):
        session = self.request("/api/admin/session")[1]
        credentials = {"username": "सुष्मा", "password": "Test-only-password-123", "setup_token": session["setup_token"]}
        status, result, _ = self.request("/api/admin/setup", credentials)
        self.assertEqual(status, 200)
        self.csrf = result["csrf"]
        self.request("/api/admin/logout", {})
        self.assertEqual(self.request("/api/admin/login", credentials)[0], 200)
        self.server.sessions.clear()
        self.assertFalse(self.request("/api/admin/session")[1]["setup_required"])
        self.assertEqual(self.request("/api/admin/login", credentials)[0], 200)

    def test_draft_publish_rename_unpublish_delete(self):
        self.setup_account()
        content = deepcopy(self.original)
        post = deepcopy(content["blogs"][0])
        post.update(slug="test-post", title="नेपाल — A new article", status="draft",
                    content="<script>alert('no')</script>\n\nSecond paragraph.")
        content["blogs"].append(post)
        self.assertEqual(self.save(content)[0], 200)
        self.assertFalse((self.root / "blog/test-post/index.html").exists())
        self.assertNotIn(post["title"], (self.root / "blog/index.html").read_text())
        post["status"] = "published"
        self.assertEqual(self.save(content)[0], 200)
        page = (self.root / "blog/test-post/index.html").read_text()
        self.assertIn(post["title"], page)
        self.assertIn("&lt;script&gt;", page)
        self.assertNotIn("<script>", page)
        post["slug"] = "new-post-address"
        self.assertEqual(self.save(content)[0], 200)
        self.assertFalse((self.root / "blog/test-post/index.html").exists())
        self.assertTrue((self.root / "blog/new-post-address/index.html").exists())
        post["status"] = "draft"
        self.assertEqual(self.save(content)[0], 200)
        self.assertFalse((self.root / "blog/new-post-address/index.html").exists())
        content["blogs"].pop()
        self.assertEqual(self.save(content)[0], 200)
        self.assertEqual(len(json.loads((self.root / "cms/site.json").read_text())["blogs"]), len(self.original["blogs"]))

    def test_conflict_and_invalid_content_leave_saved_copy_intact(self):
        self.setup_account()
        revision = self.request("/api/admin/content")[1]["revision"]
        content = deepcopy(self.original)
        content["profile"]["name"] = "Updated owner"
        self.assertEqual(self.save(content, revision)[0], 200)
        self.assertEqual(self.save(self.original, revision)[0], 409)
        duplicate = deepcopy(content)
        duplicate["blogs"].append(deepcopy(duplicate["blogs"][0]))
        self.assertEqual(self.save(duplicate)[0], 400)
        self.assertEqual(self.save(None)[0], 400)
        self.assertEqual(json.loads((self.root / "cms/site.json").read_text()), content)

    def test_custom_pages_and_project_deletion(self):
        self.setup_account()
        content = deepcopy(self.original)
        content["customPages"].append({
            "title": "Extra page", "slug": "extra-page", "description": "A page intro",
            "content": "New page content.", "status": "published", "show_in_navigation": True,
        })
        removed = content["projects"].pop(0)
        self.assertEqual(self.save(content)[0], 200)
        self.assertFalse((self.root / f"projects/{removed['slug']}/index.html").exists())
        self.assertTrue((self.root / "pages/extra-page/index.html").exists())
        self.assertIn("pages/extra-page/index.html", (self.root / "index.html").read_text())
        content["customPages"].clear()
        self.assertEqual(self.save(content)[0], 200)
        self.assertFalse((self.root / "pages/extra-page/index.html").exists())

    def test_image_upload(self):
        self.setup_account()
        png = base64.b64encode((ROOT / "assets/images/profile-photo.png").read_bytes()).decode()
        status, result, _ = self.request("/api/admin/upload", {"data": png})
        self.assertEqual(status, 200)
        self.assertTrue((self.root / result["path"]).exists())
        self.assertEqual(self.request("/" + result["path"])[0], 200)
        svg = base64.b64encode(b'<svg onload="alert(1)"/>').decode()
        self.assertEqual(self.request("/api/admin/upload", {"data": svg})[0], 400)

    def test_empty_collections_and_invalid_routes(self):
        content = deepcopy(self.original)
        for key, value in content.items():
            if isinstance(value, list):
                content[key] = []
        pages = render_site(content)
        self.assertIn("Nothing published here yet.", pages["blog/index.html"])
        self.assertIn("Nothing published here yet.", pages["projects/index.html"])
        invalid = deepcopy(self.original)
        invalid["blogs"][0]["slug"] = "../../escape"
        with self.assertRaises(ContentError):
            render_site(invalid)
        invalid = deepcopy(self.original)
        invalid["home"]["callouts"] *= 2
        with self.assertRaises(ContentError):
            render_site(invalid)

    def test_package_excludes_private_content_and_removes_unpublished_pages(self):
        output = self.root / "published"
        content = deepcopy(self.original)
        write_site(render_site(content), output, package=True)
        post_path = output / f"blog/{content['blogs'][0]['slug']}/index.html"
        self.assertTrue(post_path.exists())
        content["blogs"][0]["status"] = "draft"
        write_site(render_site(content), output, package=True)
        self.assertFalse(post_path.exists())
        for path in ["cms", ".local-admin", "_legacy", ".git", "README.md"]:
            self.assertFalse((output / path).exists(), path)
        self.assertTrue((output / "admin/admin.js").exists())
        self.assertTrue((output / "assets/css/style.css").exists())


if __name__ == "__main__":
    unittest.main()
