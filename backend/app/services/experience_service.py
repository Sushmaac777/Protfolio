from app.repositories.content_repository import content_repository
from app.schemas.experience import ExperienceRead

class ExperienceService:
    def list_experience(self) -> list[ExperienceRead]:
        return [ExperienceRead.model_validate(item) for item in content_repository.get("experience")]


experience_service = ExperienceService()
