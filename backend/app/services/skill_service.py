from app.repositories.skill_repository import SkillRepository
from app.schemas.skill import SkillCategoryRead

repository = SkillRepository()


class SkillService:
    def list_skills(self) -> list[SkillCategoryRead]:
        return [SkillCategoryRead.model_validate(category) for category in repository.list()]


skill_service = SkillService()

