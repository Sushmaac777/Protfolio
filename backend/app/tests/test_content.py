from copy import deepcopy
import json
import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.db.session import resolve_database_path
from app.main import app

client = TestClient(app)


def _admin_headers() -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"username": "admin", "password": "portfolio123"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(autouse=True)
def reset_content_store() -> None:
    headers = _admin_headers()
    client.post("/api/v1/admin/content/reset-all", headers=headers)
    yield
    client.post("/api/v1/admin/content/reset-all", headers=headers)


def test_public_content_bundle_is_available() -> None:
    response = client.get("/api/v1/content")

    assert response.status_code == 200
    payload = response.json()
    assert set(["aboutPage", "achievements", "siteCopy"]).issubset(payload.keys())
    assert payload["siteCopy"]["footer"]["title"] == "Sushma Portfolio"


def test_admin_updates_flow_through_public_routes() -> None:
    headers = _admin_headers()
    original_profile = client.get("/api/v1/profile").json()
    updated_profile = {**original_profile, "name": "Sushma Backend Driven"}

    update_response = client.put("/api/v1/admin/content/profile", json=updated_profile, headers=headers)

    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Sushma Backend Driven"
    assert client.get("/api/v1/profile").json()["name"] == "Sushma Backend Driven"


def test_admin_updates_shared_content_and_reset_all_restores_defaults() -> None:
    headers = _admin_headers()
    original_bundle = client.get("/api/v1/content").json()
    updated_site_copy = deepcopy(original_bundle["siteCopy"])
    updated_site_copy["footer"]["title"] = "Backend Source of Truth"

    update_response = client.put("/api/v1/admin/content/siteCopy", json=updated_site_copy, headers=headers)

    assert update_response.status_code == 200
    assert client.get("/api/v1/content").json()["siteCopy"]["footer"]["title"] == "Backend Source of Truth"

    reset_response = client.post("/api/v1/admin/content/reset-all", headers=headers)

    assert reset_response.status_code == 200
    assert client.get("/api/v1/content").json()["siteCopy"]["footer"]["title"] == original_bundle["siteCopy"]["footer"]["title"]


def test_direct_database_updates_flow_through_public_routes() -> None:
    profile = client.get("/api/v1/profile").json()
    updated_profile = {**profile, "name": "Updated Directly In SQLite"}
    database_path = resolve_database_path(get_settings().database_url)

    with sqlite3.connect(database_path) as connection:
        connection.execute(
            """
            UPDATE content_sections
            SET content = ?, updated_at = CURRENT_TIMESTAMP
            WHERE section = ?
            """,
            (json.dumps(updated_profile, ensure_ascii=False), "profile"),
        )
        connection.commit()

    assert client.get("/api/v1/profile").json()["name"] == "Updated Directly In SQLite"
