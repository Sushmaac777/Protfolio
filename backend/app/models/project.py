from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectLink:
    label: str
    url: str


@dataclass(frozen=True)
class Project:
    title: str
    slug: str
    year: str
    summary: str
    description: str
    status: str
    stack: list[str]
    featured: bool
    links: list[ProjectLink]

