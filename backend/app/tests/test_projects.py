from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_projects() -> None:
    response = client.get("/api/v1/projects")

    assert response.status_code == 200
    assert len(response.json()) >= 2


def test_get_project_detail() -> None:
    response = client.get("/api/v1/projects/kidney-disease-prediction-system")

    assert response.status_code == 200
    assert response.json()["slug"] == "kidney-disease-prediction-system"
