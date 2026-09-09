"""
DB Service — DynamoDB + S3 with local in-memory mock fallback when AWS creds absent.
Implements I2 (DynamoDB TTL = lambda) and I1 (role separation noted).
"""
import json
import time
from config import USE_AWS, AWS_REGION, DYNAMODB_TABLE, S3_BUCKET
from models.schema import (
    PersonalityIngestionSchema, HumorStyle, AdviceTone,
    SignaturePhrase, TopicOpinion
)

def _init_local_db() -> dict[str, dict]:
    v1 = PersonalityIngestionSchema(
        vault_id="vault-1",
        name="Rajesh Banerjee",
        relationship="Your Father",
        description="Structural engineer, avid chai drinker, lover of vintage radios and quiet wisdom.",
        humor_style=HumorStyle(style="Dry & Sarcastic", confidence=0.96),
        advice_tone=AdviceTone(tone="Tough Love & Pragmatic", confidence=0.92),
        active_topics=["Family Legacy", "Engineering", "Gardening", "Financial Independence", "Classic Rock"],
        relationship_tone="Warmly protective, calls you 'kiddo', expects excellence with quiet pride.",
        signature_phrases=[
            SignaturePhrase(id="p1", phrase="Did you measure twice before you cut once?", confidence=0.98),
            SignaturePhrase(id="p2", phrase="Listen kiddo, life doesn't hand out refunds.", confidence=0.95),
            SignaturePhrase(id="p3", phrase="Let's grab a hot chai first, then we'll fix it.", confidence=0.97),
            SignaturePhrase(id="p4", phrase="Always build things to last fifty years.", confidence=0.92),
        ],
        topic_opinions=[
            TopicOpinion(topic="Career & Ambition", stance="Strive for quiet mastery over loud shortcuts. Your work is your signature.", intensity=92.0, confidence=0.92),
            TopicOpinion(topic="Handling Failure", stance="Failure is just expensive tuition. Learn the lesson quickly.", intensity=88.0, confidence=0.88),
            TopicOpinion(topic="Money & Security", stance="Keep debts zero, invest in books and tools, live below your means.", intensity=90.0, confidence=0.90),
        ],
        completeness_score=94.0,
        schema_confidence=0.92,
    )
    v2 = PersonalityIngestionSchema(
        vault_id="vault-2",
        name="Sunita Patel",
        relationship="Your Grandmother",
        description="Master storyteller, gardener, keeper of family recipes and unconditional warmth.",
        humor_style=HumorStyle(style="Warm & Gentle", confidence=0.91),
        advice_tone=AdviceTone(tone="Nurturing & Patient", confidence=0.94),
        active_topics=["Cooking", "Patience", "Family History", "Poetry"],
        relationship_tone="Soft, calling you 'beta', emphasizing peace of mind over urgency.",
        signature_phrases=[
            SignaturePhrase(id="sp1", phrase="Have you eaten properly today?", confidence=0.99),
            SignaturePhrase(id="sp2", phrase="Good things take time to simmer.", confidence=0.94),
        ],
        completeness_score=78.0,
        schema_confidence=0.88,
    )
    d1 = json.loads(v1.model_dump_json())
    d1.update({"pk": "VAULT#vault-1", "sk": "SCHEMA#v1"})
    d2 = json.loads(v2.model_dump_json())
    d2.update({"pk": "VAULT#vault-2", "sk": "SCHEMA#v1"})
    return {"vault-1": d1, "vault-2": d2}

_LOCAL_DB: dict[str, dict] = _init_local_db()


def _get_dynamodb():
    import boto3
    return boto3.resource("dynamodb", region_name=AWS_REGION)


def _get_s3():
    import boto3
    return boto3.client("s3", region_name=AWS_REGION)


async def save_vault(schema: PersonalityIngestionSchema) -> bool:
    item = json.loads(schema.model_dump_json())
    item["pk"] = f"VAULT#{schema.vault_id}"
    item["sk"] = "SCHEMA#v1"
    if schema.data_lifetime_seconds > 0:
        item["ttl"] = int(time.time()) + schema.data_lifetime_seconds
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            table.put_item(Item=item)
            return True
        except Exception:
            pass
    _LOCAL_DB[schema.vault_id] = item
    return True


async def load_vault(vault_id: str) -> PersonalityIngestionSchema | None:
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            r = table.get_item(Key={"pk": f"VAULT#{vault_id}", "sk": "SCHEMA#v1"})
            item = r.get("Item")
            if item:
                return PersonalityIngestionSchema(**item)
        except Exception:
            pass
    item = _LOCAL_DB.get(vault_id)
    if item:
        clean = {k: v for k, v in item.items() if k not in ("pk", "sk", "ttl")}
        return PersonalityIngestionSchema(**clean)
    return None


async def list_vaults() -> list[PersonalityIngestionSchema]:
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            r = table.scan(FilterExpression="begins_with(pk, :v)", ExpressionAttributeValues={":v": "VAULT#"})
            return [PersonalityIngestionSchema(**i) for i in r.get("Items", [])]
        except Exception:
            pass
    return [
        PersonalityIngestionSchema(**{k: v for k, v in item.items() if k not in ("pk", "sk", "ttl")})
        for item in _LOCAL_DB.values()
        if item.get("pk", "").startswith("VAULT#")
    ]


async def upload_audio_s3(vault_id: str, audio_bytes: bytes, filename: str) -> str:
    key = f"audio/{vault_id}/{filename}"
    if USE_AWS:
        try:
            s3 = _get_s3()
            s3.put_object(
                Bucket=S3_BUCKET, Key=key, Body=audio_bytes,
                ContentType="audio/mpeg",
                ServerSideEncryption="AES256",
            )
            return f"https://{S3_BUCKET}.s3.amazonaws.com/{key}"
        except Exception:
            pass
    return f"/mock-audio/{vault_id}/{filename}"
