from pydantic import BaseModel, ConfigDict


class BlogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    slug: str
    excerpt: str
    content: str
    published_at: str
    reading_time: str
    tags: list[str]

