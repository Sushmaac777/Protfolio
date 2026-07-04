from fastapi import APIRouter

from app.schemas.skill import SkillCategoryRead
from app.services.skill_service import skill_service

router = APIRouter()


@router.get("", response_model=list[SkillCategoryRead])
def list_skills() -> list[SkillCategoryRead]:
    return skill_service.list_skills()

