from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_submit_contact() -> None:
    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Alex",
            "email": "alex@example.com",
            "topic": "Project inquiry",
            "message": "I would love to talk about building a product landing page together.",
        },
    )

    assert response.status_code == 201
    assert response.json()["status"] == "received"
