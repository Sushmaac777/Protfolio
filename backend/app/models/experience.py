from dataclasses import dataclass


@dataclass(frozen=True)
class Experience:
    role: str
    company: str
    period: str
    summary: str
    highlights: list[str]
    technologies: list[str]

