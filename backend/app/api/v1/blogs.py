from fastapi import APIRouter, HTTPException, status

from app.schemas.blog import BlogRead
from app.services.blog_service import blog_service

router = APIRouter()


@router.get("", response_model=list[BlogRead])
def list_blogs() -> list[BlogRead]:
    return blog_service.list_blogs()


@router.get("/{slug}", response_model=BlogRead)
def get_blog(slug: str) -> BlogRead:
    blog = blog_service.get_blog(slug)
    if blog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found.")
    return blog

