from fastapi import APIRouter, status

from app.schemas.contact import ContactCreate, ContactResponse
from app.services.contact_service import contact_service

router = APIRouter()


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate) -> ContactResponse:
    return contact_service.submit(payload)

