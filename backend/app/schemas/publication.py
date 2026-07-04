from pydantic import BaseModel, ConfigDict


class PublicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    venue: str
    year: str
    abstract: str
    link: str
    tags: list[str]

