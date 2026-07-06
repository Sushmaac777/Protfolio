from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"
    debug: bool = True
    database_url: str = "postgresql://postgres:postgres@localhost:5432/portfolio"
    frontend_origin: str = "http://localhost:5173"
    admin_username: str = "admin"
    admin_password: str = "portfolio123"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="PORTFOLIO_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
