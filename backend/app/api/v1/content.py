from typing import Any

from fastapi import APIRouter

from app.repositories.content_repository import content_repository

router = APIRouter()


@router.get("", response_model=dict[str, Any])
def get_public_content() -> dict[str, Any]:
    return content_repository.get_public_content()
