from app.repositories.content_repository import content_repository
from app.schemas.skill import SkillCategoryRead

class SkillService:
    def list_skills(self) -> list[SkillCategoryRead]:
        return [SkillCategoryRead.model_validate(category) for category in content_repository.get("skills")]


skill_service = SkillService()
