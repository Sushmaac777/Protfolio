from app.repositories.content_repository import content_repository
from app.schemas.publication import PublicationRead

class PublicationService:
    def list_publications(self) -> list[PublicationRead]:
        return [PublicationRead.model_validate(publication) for publication in content_repository.get("publications")]


publication_service = PublicationService()
