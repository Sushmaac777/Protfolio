from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import AuthToken, LoginRequest
from app.services.auth_service import auth_service

router = APIRouter()


@router.post("/login", response_model=AuthToken)
def login(payload: LoginRequest) -> AuthToken:
    token = auth_service.login(payload.username, payload.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )
    return AuthToken(access_token=token)

