import hmac
import secrets

from app.core.config import get_settings


def authenticate_user(username: str, password: str) -> bool:
    settings = get_settings()
    return hmac.compare_digest(username, settings.admin_username) and hmac.compare_digest(
        password, settings.admin_password
    )


def create_access_token() -> str:
    return f"mock-token-{secrets.token_urlsafe(16)}"

