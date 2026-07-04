from dataclasses import dataclass


@dataclass(frozen=True)
class ContactMessage:
    name: str
    email: str
    topic: str
    message: str
    created_at: str

