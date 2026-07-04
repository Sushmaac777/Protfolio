from app.repositories.publication_repository import PublicationRepository
from app.schemas.publication import PublicationRead

repository = PublicationRepository()


class PublicationService:
    def list_publications(self) -> list[PublicationRead]:
        return [PublicationRead.model_validate(publication) for publication in repository.list()]


publication_service = PublicationService()

