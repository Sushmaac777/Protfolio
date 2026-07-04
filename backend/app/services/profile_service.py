from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import ProfileRead

repository = ProfileRepository()


class ProfileService:
    def get_profile(self) -> ProfileRead:
        return ProfileRead.model_validate(repository.get())


profile_service = ProfileService()

