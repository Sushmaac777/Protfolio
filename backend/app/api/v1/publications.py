from fastapi import APIRouter

from app.schemas.publication import PublicationRead
from app.services.publication_service import publication_service

router = APIRouter()


@router.get("", response_model=list[PublicationRead])
def list_publications() -> list[PublicationRead]:
    return publication_service.list_publications()

