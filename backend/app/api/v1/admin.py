from fastapi import APIRouter, Depends

from app.api.dependencies import require_admin

router = APIRouter()


@router.get("/health")
def admin_health(_: str = Depends(require_admin)) -> dict[str, str]:
    return {"status": "admin-ok"}

