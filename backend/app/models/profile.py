from dataclasses import dataclass


@dataclass(frozen=True)
class SocialLink:
    label: str
    url: str


@dataclass(frozen=True)
class Profile:
    name: str
    title: str
    location: str
    summary: str
    email: str
    availability: str
    highlights: list[str]
    social_links: list[SocialLink]

