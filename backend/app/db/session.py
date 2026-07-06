from __future__ import annotations

import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Literal

import psycopg2
from psycopg2.extras import RealDictCursor

from app.core.config import get_settings

DatabaseBackend = Literal["sqlite", "postgresql"]
BACKEND_ROOT = Path(__file__).resolve().parents[2]
SQLITE_URL_PREFIX = "sqlite:///"
POSTGRES_URL_PREFIXES = ("postgresql://", "postgres://")


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        return f"postgresql://{database_url[len('postgres://') :]}"

    return database_url


def get_database_backend(database_url: str | None = None) -> DatabaseBackend:
    normalized_database_url = normalize_database_url(database_url or get_settings().database_url)

    if normalized_database_url.startswith(SQLITE_URL_PREFIX):
        return "sqlite"

    if normalized_database_url.startswith(POSTGRES_URL_PREFIXES):
        return "postgresql"

    raise ValueError("Only sqlite:/// and postgresql:// database URLs are supported.")


def resolve_database_path(database_url: str) -> Path:
    normalized_database_url = normalize_database_url(database_url)

    if get_database_backend(normalized_database_url) != "sqlite":
        raise ValueError("Only sqlite:/// database URLs are supported.")

    raw_path = normalized_database_url[len(SQLITE_URL_PREFIX) :]
    if not raw_path:
        raise ValueError("The database URL must include a path.")

    path = Path(raw_path)
    if not path.is_absolute():
        path = BACKEND_ROOT / path

    return path


@dataclass
class DatabaseSession:
    connection: Any
    backend: DatabaseBackend

    def execute(self, query: str, params: tuple[Any, ...] = ()) -> None:
        if self.backend == "sqlite":
            self.connection.execute(query, params)
            return

        with self.connection.cursor() as cursor:
            cursor.execute(query, params)

    def executemany(self, query: str, params_list: list[tuple[Any, ...]]) -> None:
        if not params_list:
            return

        if self.backend == "sqlite":
            self.connection.executemany(query, params_list)
            return

        with self.connection.cursor() as cursor:
            cursor.executemany(query, params_list)

    def fetchone(self, query: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
        if self.backend == "sqlite":
            row = self.connection.execute(query, params).fetchone()
            return None if row is None else dict(row)

        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            row = cursor.fetchone()
            return None if row is None else dict(row)

    def fetchall(self, query: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
        if self.backend == "sqlite":
            rows = self.connection.execute(query, params).fetchall()
            return [dict(row) for row in rows]

        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def commit(self) -> None:
        self.connection.commit()


@contextmanager
def get_session() -> Iterator[DatabaseSession]:
    database_url = normalize_database_url(get_settings().database_url)
    backend = get_database_backend(database_url)

    if backend == "sqlite":
        database_path = resolve_database_path(database_url)
        database_path.parent.mkdir(parents=True, exist_ok=True)

        connection = sqlite3.connect(database_path, check_same_thread=False)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        session = DatabaseSession(connection=connection, backend=backend)
    else:
        connection = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
        session = DatabaseSession(connection=connection, backend=backend)

    try:
        yield session
    finally:
        session.connection.close()
