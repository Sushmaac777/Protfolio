from typing import Optional

from app.repositories.blog_repository import BlogRepository
from app.schemas.blog import BlogRead

repository = BlogRepository()


class BlogService:
    def list_blogs(self) -> list[BlogRead]:
        return [BlogRead.model_validate(blog) for blog in repository.list()]

    def get_blog(self, slug: str) -> Optional[BlogRead]:
        blog = repository.get_by_slug(slug)
        return BlogRead.model_validate(blog) if blog else None


blog_service = BlogService()
