from app.repositories.content_repository import content_repository
from app.schemas.profile import ProfileRead

class ProfileService:
    def get_profile(self) -> ProfileRead:
        return ProfileRead.model_validate(content_repository.get("profile"))


profile_service = ProfileService()
