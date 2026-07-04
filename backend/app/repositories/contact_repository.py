from app.models.contact import ContactMessage

_submissions: list[ContactMessage] = []


class ContactRepository:
    def save(self, message: ContactMessage) -> ContactMessage:
        _submissions.append(message)
        return message

    def list(self) -> list[ContactMessage]:
        return list(_submissions)

