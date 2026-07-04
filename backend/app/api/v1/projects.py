from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.project import ProjectRead
from app.services.project_service import project_service

router = APIRouter()


@router.get("", response_model=list[ProjectRead])
def list_projects(featured: Optional[bool] = Query(default=None)) -> list[ProjectRead]:
    return project_service.list_projects(featured=featured)


@router.get("/{slug}", response_model=ProjectRead)
def get_project(slug: str) -> ProjectRead:
    project = project_service.get_project(slug)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return project
