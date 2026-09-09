"""
Integration Tests: Evoke FastAPI Endpoints.
Verifies:
1. Health and system connectivity matrix endpoints.
2. Section VI pre-registered evaluation metrics endpoint.
3. Conversation endpoint with Humility Gate routing and audit logging.
4. Tamper-evident audit log retrieval endpoint.
"""
import sys
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
from fastapi.testclient import TestClient
from main import app
from models.schema import PersonalityIngestionSchema, HumorStyle, AdviceTone
from services.db_service import save_vault

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_vault():
    import asyncio
    schema = PersonalityIngestionSchema(
        vault_id="vault-integration-test",
        name="Integration Test Persona",
        relationship="Parent",
        humor_style=HumorStyle(style="Witty & Thoughtful", confidence=0.90),
        advice_tone=AdviceTone(tone="Direct & Pragmatic", confidence=0.88),
        relationship_tone="Warm and supportive",
        schema_confidence=0.89,
    )
    asyncio.run(save_vault(schema))


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "aws_mode" in data


def test_system_status_endpoint():
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert "aws_cloud" in data
    assert "external_apis" in data
    assert "dynamodb_pis_store" in data["aws_cloud"]["services"]
    assert "cognito_user_pools" in data["aws_cloud"]["services"]


def test_evaluation_results_endpoint():
    res = client.get("/api/evaluation/results")
    assert res.status_code == 200
    data = res.json()
    assert data["authenticity"]["delta"] == 1.47
    assert data["fabrication_rate"]["reduction_pct"] == 87.0
    assert data["infrastructure_cost_inr"] == 0


def test_converse_endpoint():
    req = {
        "vault_id": "vault-integration-test",
        "message": "What is your advice on taking risks?",
        "conversation_history": []
    }
    res = client.post("/api/converse", json=req)
    assert res.status_code == 200
    data = res.json()
    assert "text" in data
    assert "latency_ms" in data
    assert "humility_triggered" in data
    assert "model_used" in data


def test_audit_logs_endpoint():
    res = client.get("/api/audit/logs?limit=10")
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
