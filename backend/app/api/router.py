from fastapi import APIRouter

from app.api.v1 import admin, auth, blogs, contact, content, experience, profile, projects, publications, skills

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(publications.router, prefix="/publications", tags=["publications"])
api_router.include_router(experience.router, prefix="/experience", tags=["experience"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(blogs.router, prefix="/blogs", tags=["blogs"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
