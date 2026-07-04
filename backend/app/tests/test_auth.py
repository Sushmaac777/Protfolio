from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_login_success() -> None:
    response = client.post("/api/v1/auth/login", json={"username": "admin", "password": "portfolio123"})

    assert response.status_code == 200
    assert response.json()["access_token"].startswith("mock-token-")


def test_login_failure() -> None:
    response = client.post("/api/v1/auth/login", json={"username": "wrong", "password": "wrong"})

    assert response.status_code == 401

