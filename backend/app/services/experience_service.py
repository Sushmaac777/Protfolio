from app.repositories.experience_repository import ExperienceRepository
from app.schemas.experience import ExperienceRead

repository = ExperienceRepository()


class ExperienceService:
    def list_experience(self) -> list[ExperienceRead]:
        return [ExperienceRead.model_validate(item) for item in repository.list()]


experience_service = ExperienceService()

