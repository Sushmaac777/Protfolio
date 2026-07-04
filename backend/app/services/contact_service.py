from datetime import datetime, timezone

from app.models.contact import ContactMessage
from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import ContactCreate, ContactResponse
from app.utils.email import build_contact_receipt

repository = ContactRepository()


class ContactService:
    def submit(self, payload: ContactCreate) -> ContactResponse:
        timestamp = datetime.now(timezone.utc).isoformat()
        repository.save(
            ContactMessage(
                name=payload.name,
                email=payload.email,
                topic=payload.topic,
                message=payload.message,
                created_at=timestamp,
            )
        )
        build_contact_receipt(payload.name)
        return ContactResponse(status="received", submitted_at=timestamp)


contact_service = ContactService()

