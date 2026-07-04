from typing import Optional

from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectRead

repository = ProjectRepository()


class ProjectService:
    def list_projects(self, featured: Optional[bool] = None) -> list[ProjectRead]:
        projects = repository.list()
        if featured is not None:
            projects = [project for project in projects if project.featured == featured]
        return [ProjectRead.model_validate(project) for project in projects]

    def get_project(self, slug: str) -> Optional[ProjectRead]:
        project = repository.get_by_slug(slug)
        return ProjectRead.model_validate(project) if project else None


project_service = ProjectService()
