from typing import Optional

from app.repositories.content_repository import content_repository
from app.schemas.blog import BlogRead

class BlogService:
    def list_blogs(self) -> list[BlogRead]:
        return [BlogRead.model_validate(blog) for blog in content_repository.get("blogs")]

    def get_blog(self, slug: str) -> Optional[BlogRead]:
        blogs = [BlogRead.model_validate(blog) for blog in content_repository.get("blogs")]
        return next((blog for blog in blogs if blog.slug == slug), None)


blog_service = BlogService()
