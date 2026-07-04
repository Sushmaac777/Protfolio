from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_blog_detail() -> None:
    response = client.get("/api/v1/blogs/building-a-portfolio-that-connects-qa-ai-and-research")

    assert response.status_code == 200
    assert "portfolio" in response.json()["slug"]
