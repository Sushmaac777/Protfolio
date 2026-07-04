from pydantic import BaseModel, ConfigDict


class ExperienceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    role: str
    company: str
    period: str
    summary: str
    highlights: list[str]
    technologies: list[str]

