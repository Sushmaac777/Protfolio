from dataclasses import dataclass


@dataclass(frozen=True)
class Publication:
    title: str
    venue: str
    year: str
    abstract: str
    link: str
    tags: list[str]

