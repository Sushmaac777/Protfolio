from typing import Optional

from app.core.security import authenticate_user, create_access_token


class AuthService:
    def login(self, username: str, password: str) -> Optional[str]:
        if authenticate_user(username, password):
            return create_access_token()
        return None


auth_service = AuthService()
