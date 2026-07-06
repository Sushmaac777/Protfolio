from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.api.dependencies import require_admin
from app.repositories.content_repository import content_repository

router = APIRouter()


@router.get("/health")
def admin_health(_: str = Depends(require_admin)) -> dict[str, str]:
    return {"status": "admin-ok"}


@router.get("/content", response_model=dict[str, Any])
def get_admin_content(_: str = Depends(require_admin)) -> dict[str, Any]:
    return content_repository.get_all()


@router.put("/content/{section}")
def update_admin_content(section: str, payload: Any = Body(...), _: str = Depends(require_admin)) -> Any:
    if not content_repository.exists(section):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content section not found.")

    return content_repository.update(section, payload)


@router.post("/content/{section}/reset")
def reset_admin_content_section(section: str, _: str = Depends(require_admin)) -> Any:
    if not content_repository.exists(section):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content section not found.")

    return content_repository.reset(section)


@router.post("/content/reset-all", response_model=dict[str, Any])
def reset_all_admin_content(_: str = Depends(require_admin)) -> dict[str, Any]:
    return content_repository.reset_all()
