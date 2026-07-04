from fastapi import APIRouter

from app.schemas.profile import ProfileRead
from app.services.profile_service import profile_service

router = APIRouter()


@router.get("", response_model=ProfileRead)
def get_profile() -> ProfileRead:
    return profile_service.get_profile()

