from dataclasses import dataclass


@dataclass(frozen=True)
class Blog:
    title: str
    slug: str
    excerpt: str
    content: str
    published_at: str
    reading_time: str
    tags: list[str]

