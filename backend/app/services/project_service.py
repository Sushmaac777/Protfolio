from typing import Optional

from app.schemas.project import ProjectRead
from app.repositories.content_repository import content_repository


class ProjectService:
    def list_projects(self, featured: Optional[bool] = None) -> list[ProjectRead]:
        projects = [ProjectRead.model_validate(project) for project in content_repository.get("projects")]
        if featured is not None:
            projects = [project for project in projects if project.featured == featured]
        return projects

    def get_project(self, slug: str) -> Optional[ProjectRead]:
        projects = [ProjectRead.model_validate(project) for project in content_repository.get("projects")]
        return next((project for project in projects if project.slug == slug), None)


project_service = ProjectService()
