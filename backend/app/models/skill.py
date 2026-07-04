from dataclasses import dataclass


@dataclass(frozen=True)
class SkillItem:
    name: str
    level: int


@dataclass(frozen=True)
class SkillCategory:
    name: str
    description: str
    items: list[SkillItem]

