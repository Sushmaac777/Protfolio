from pydantic import BaseModel, ConfigDict, Field


class SkillItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    level: int = Field(ge=1, le=100)


class SkillCategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    description: str
    items: list[SkillItemRead]
