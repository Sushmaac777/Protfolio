from pydantic import BaseModel, ConfigDict, EmailStr


class SocialLinkRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    label: str
    url: str


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    title: str
    location: str
    summary: str
    email: EmailStr
    availability: str
    highlights: list[str]
    social_links: list[SocialLinkRead]
