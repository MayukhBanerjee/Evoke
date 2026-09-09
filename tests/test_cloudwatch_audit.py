"""
Unit Tests: Invariant I4 (Tamper-Evident Audit Trails).
Verifies:
1. Every conversational access event is recorded with query, context, response preview, and latency.
2. Humility gate activation status is accurately logged.
3. Audit log reader correctly retrieves recent entries for family auditors.
"""
import sys
import asyncio
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.cloudwatch_audit import log_conversation_event, get_recent_audit_logs

def test_audit_event_logging():
    """Verify that conversation access events are recorded with Invariant I4 attributes."""
    record = asyncio.run(log_conversation_event(
        vault_id="vault-audit-unit-test",
        query="What is your advice on failure?",
        context_keys=["advice_tone", "topic:Handling Failure"],
        response_text="Failure is just expensive tuition. Learn the lesson and keep moving forward.",
        latency_ms=350,
        humility_triggered=False,
        model_used="llama-3.3-70b-versatile"
    ))
    
    assert record["vault_id"] == "vault-audit-unit-test"
    assert record["invariant"] == "I4_Auditability"
    assert record["humility_triggered"] is False
    assert record["latency_ms"] == 350
    assert "advice_tone" in record["context_fields"]
    
    # Verify retrieval
    recent = get_recent_audit_logs(vault_id="vault-audit-unit-test", limit=5)
    assert len(recent) >= 1
    assert recent[0]["query"] == "What is your advice on failure?"
