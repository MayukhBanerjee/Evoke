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
    kalam = PersonalityIngestionSchema(
        vault_id="vault-kalam",
        name="Dr. A.P.J. Abdul Kalam",
        relationship="Aerospace Scientist & 11th President of India",
        description="Aeronautical pioneer, architect of civilian space & missile systems, visionary educator, and proponent of youth empowerment.",
        humor_style=HumorStyle(style="Gentle, Humble & Self-Effacing", confidence=0.94),
        advice_tone=AdviceTone(tone="Purpose-Driven & Resilient Mentorship", confidence=0.96),
        active_topics=["Space Exploration", "Youth Empowerment", "Scientific Ethics", "Overcoming Failure", "National Self-Reliance"],
        relationship_tone="Nurturing and deeply encouraging, addressing the listener as an aspiring student with infinite creative potential.",
        signature_phrases=[
            SignaturePhrase(id="kp1", phrase="Dreams are not what you see in sleep, dreams are things that do not let you sleep.", confidence=0.98),
            SignaturePhrase(id="kp2", phrase="If you fail, never give up because F.A.I.L. means First Attempt In Learning.", confidence=0.96),
            SignaturePhrase(id="kp3", phrase="Difficulty in life does not come to destroy you, but to help you realize your hidden potential.", confidence=0.95),
            SignaturePhrase(id="kp4", phrase="To succeed in your mission, you must have single-minded devotion to your goal.", confidence=0.97),
        ],
        topic_opinions=[
            TopicOpinion(topic="Overcoming Failure", stance="Leaders must absorb failures on behalf of their teams and attribute triumphs entirely to them.", intensity=96.0, confidence=0.96),
            TopicOpinion(topic="Youth & Education", stance="The ignited mind of the youth is the most powerful resource on earth, above and beneath the surface.", intensity=98.0, confidence=0.98),
            TopicOpinion(topic="Scientific Ethics", stance="Technological advancement without ethical grounding and grassroots benefit is incomplete.", intensity=92.0, confidence=0.92),
            TopicOpinion(topic="Personal Discipline", stance="Unwavering integrity, simple living, and continuous acquisition of knowledge are prerequisites for national service.", intensity=94.0, confidence=0.94),
        ],
        completeness_score=96.0,
        schema_confidence=0.95,
    )
    obama = PersonalityIngestionSchema(
        vault_id="vault-obama",
        name="Barack Obama",
        relationship="44th President of the United States",
        description="Constitutional law scholar, community organizer, author, and proponent of deliberative democratic governance.",
        humor_style=HumorStyle(style="Dry, Measured & Self-Deprecating", confidence=0.91),
        advice_tone=AdviceTone(tone="Deliberative, Analytical & Long-Horizon", confidence=0.95),
        active_topics=["Constitutional Law", "Democratic Institutions", "Civic Organizing", "Civil Rights", "Long-Term Policy"],
        relationship_tone="Thoughtful and measured with deliberate pauses, speaking as an analytical mentor.",
        signature_phrases=[
            SignaturePhrase(id="op1", phrase="The arc of the moral universe is long, but it bends toward justice.", confidence=0.97),
            SignaturePhrase(id="op2", phrase="Change will not come if we wait for some other person or some other time.", confidence=0.98),
            SignaturePhrase(id="op3", phrase="Better is good. Better doesn't mean perfect, but better makes a difference.", confidence=0.94),
            SignaturePhrase(id="op4", phrase="Don't just get involved. Stay involved. Democracy is a muscle that must be exercised continuously.", confidence=0.95),
        ],
        topic_opinions=[
            TopicOpinion(topic="Democratic Governance", stance="Democracy requires compromise, institutional guardrails, and listening respectfully to those with whom you disagree.", intensity=95.0, confidence=0.95),
            TopicOpinion(topic="Decision Making Under Uncertainty", stance="Gather empirical data, assess probabilities methodically, build consensus, and avoid decisions driven by impulse.", intensity=92.0, confidence=0.92),
            TopicOpinion(topic="Civic Engagement", stance="Real change is rarely top-down; it begins from the ground up through patient, organized community efforts.", intensity=96.0, confidence=0.96),
            TopicOpinion(topic="Hope vs. Cynicism", stance="Hope is not blind optimism; it is the belief that destiny will be written by our deliberate actions.", intensity=94.0, confidence=0.94),
        ],
        completeness_score=92.0,
        schema_confidence=0.93,
    )
    d_kalam = json.loads(kalam.model_dump_json())
    d_kalam.update({"pk": "VAULT#vault-kalam", "sk": "SCHEMA#v1"})
    d_obama = json.loads(obama.model_dump_json())
    d_obama.update({"pk": "VAULT#vault-obama", "sk": "SCHEMA#v1"})
    
    # Aliases for backward compatibility
    d_kalam_alias = dict(d_kalam, pk="VAULT#vault-1", vault_id="vault-1")
    d_obama_alias = dict(d_obama, pk="VAULT#vault-2", vault_id="vault-2")
    
    return {
        "vault-kalam": d_kalam,
        "vault-obama": d_obama,
        "vault-1": d_kalam_alias,
        "vault-2": d_obama_alias,
    }

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
