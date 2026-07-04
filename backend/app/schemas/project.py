from pydantic import BaseModel, ConfigDict


class ProjectLinkRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    label: str
    url: str


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    slug: str
    year: str
    summary: str
    description: str
    status: str
    stack: list[str]
    featured: bool
    links: list[ProjectLinkRead]
