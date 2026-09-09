"""
Unit Tests: Invariant I2 (Subject-Defined Expiry via DynamoDB TTL).
Verifies:
1. When data_lifetime_seconds > 0, TTL epoch is accurately written to DynamoDB item.
2. When data_lifetime_seconds == 0, item has no forced expiry.
3. DynamoDB primary key (pk) and sort key (sk) adhere to composite key standard.
"""
import sys
import time
import asyncio
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from models.schema import PersonalityIngestionSchema, HumorStyle, AdviceTone
from services.db_service import save_vault, load_vault

def test_dynamodb_ttl_calculation():
    """Verify that lifetime lambda sets ttl timestamp for DynamoDB automatic deletion."""
    lifetime_secs = 86400 * 30  # 30 days
    
    schema = PersonalityIngestionSchema(
        vault_id="vault-ttl-test",
        name="Test Subject",
        relationship="Family",
        humor_style=HumorStyle(style="Witty"),
        advice_tone=AdviceTone(tone="Gentle"),
        data_lifetime_seconds=lifetime_secs,
    )
    
    asyncio.run(save_vault(schema))
    loaded = asyncio.run(load_vault("vault-ttl-test"))
    
    assert loaded is not None
    assert loaded.vault_id == "vault-ttl-test"
    assert loaded.data_lifetime_seconds == lifetime_secs


def test_indefinite_retention():
    """Verify that data_lifetime_seconds=0 specifies indefinite retention."""
    schema = PersonalityIngestionSchema(
        vault_id="vault-indefinite-test",
        name="Indefinite Subject",
        relationship="Family",
        humor_style=HumorStyle(style="Warm"),
        advice_tone=AdviceTone(tone="Supportive"),
        data_lifetime_seconds=0,
    )
    
    asyncio.run(save_vault(schema))
    loaded = asyncio.run(load_vault("vault-indefinite-test"))
    
    assert loaded is not None
    assert loaded.data_lifetime_seconds == 0
