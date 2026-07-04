from fastapi import APIRouter

from app.schemas.experience import ExperienceRead
from app.services.experience_service import experience_service

router = APIRouter()


@router.get("", response_model=list[ExperienceRead])
def list_experience() -> list[ExperienceRead]:
    return experience_service.list_experience()

