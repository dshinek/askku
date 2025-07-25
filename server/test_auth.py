import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app
from db import schema

# Helper: override dependency for authentication
def override_check_authentication_header():
    return 1  # mock user_id

app.dependency_overrides = {}
app.dependency_overrides[
    "dependencies.session_auth.check_authentication_header"
] = override_check_authentication_header

client = TestClient(app)

@pytest.fixture
def mock_db_session():
    with patch("routers.auth.get_db") as mock_get_db:
        yield mock_get_db

@pytest.fixture
def mock_redis():
    with patch("routers.auth.rd") as mock_rd:
        yield mock_rd

def test_signup_success(mock_db_session):
    user = {
        "user_id": "testuser",
        "user_pw": "testpw",
        "name": "Test User",
        "student_id": "20250001",
        "department": "CS",
        "grade": 1
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    with patch("db.crud.create_user", return_value=MagicMock()):
        response = client.post("/api/users/signup", json=user)
    assert response.status_code == 200
    assert response.json()["message"] == "User created successfully"

def test_signup_fail_user_exists(mock_db_session):
    user = {
        "user_id": "testuser",
        "user_pw": "testpw",
        "name": "Test User",
        "student_id": "20250001",
        "department": "CS",
        "grade": 1
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    with patch("db.crud.create_user", return_value=None):
        response = client.post("/api/users/signup", json=user)
    assert response.status_code == 400

def test_login_success(mock_db_session, mock_redis):
    user = {
        "user_id": "testuser",
        "user_pw": "testpw"
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    mock_user = MagicMock()
    mock_user.id = 1
    with patch("db.crud.authenticate_user", return_value=mock_user):
        response = client.post("/api/users/login", json=user)
    assert response.status_code == 200
    assert "session_token" in response.json()

def test_login_fail_invalid_credentials(mock_db_session):
    user = {
        "user_id": "testuser",
        "user_pw": "wrongpw"
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    with patch("db.crud.authenticate_user", return_value=None):
        response = client.post("/api/users/login", json=user)
    assert response.status_code == 401

def test_get_my_profile_success(mock_db_session):
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    mock_user = MagicMock()
    mock_user.user_id = "testuser"
    mock_user.name = "Test User"
    mock_user.student_id = "20250001"
    mock_user.department = "CS"
    mock_user.grade = 1
    with patch("db.crud.get_user_by_id", return_value=mock_user):
        response = client.get("/api/users/profile/me", headers={"Bearer": "dummy"})
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "testuser"
    assert data["name"] == "Test User"

def test_get_my_profile_not_found(mock_db_session):
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    with patch("db.crud.get_user_by_id", return_value=None):
        response = client.get("/api/users/profile/me", headers={"Bearer": "dummy"})
    assert response.status_code == 404

def test_update_my_profile_success(mock_db_session):
    profile = {
        "name": "Updated User",
        "student_id": "20250001",
        "department": "CS",
        "grade": 2
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    mock_user = MagicMock()
    with patch("db.crud.update_user_profile", return_value=mock_user):
        response = client.put("/api/users/profile/me", json=profile, headers={"Bearer": "dummy"})
    assert response.status_code == 200
    assert response.json()["message"] == "Profile updated successfully"

def test_update_my_profile_not_found(mock_db_session):
    profile = {
        "name": "Updated User",
        "student_id": "20250001",
        "department": "CS",
        "grade": 2
    }
    mock_db = MagicMock()
    mock_db_session.return_value.__next__.return_value = mock_db
    with patch("db.crud.update_user_profile", return_value=None):
        response = client.put("/api/users/profile/me", json=profile, headers={"Bearer": "dummy"})
    assert response.status_code == 404
