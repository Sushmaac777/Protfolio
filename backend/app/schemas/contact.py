from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    topic: str = Field(min_length=2, max_length=80)
    message: str = Field(min_length=10, max_length=1500)


class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: str
    submitted_at: str

