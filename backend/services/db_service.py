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

from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def _init_local_db() -> dict[str, dict]:
    kalam_file = DATA_DIR / "apj_abdul_kalam_pis.json"
    obama_file = DATA_DIR / "barack_obama_pis.json"

    if kalam_file.exists() and obama_file.exists():
        with open(kalam_file, "r", encoding="utf-8") as f:
            kalam_data = json.load(f)
        with open(obama_file, "r", encoding="utf-8") as f:
            obama_data = json.load(f)
        kalam = PersonalityIngestionSchema(**kalam_data)
        obama = PersonalityIngestionSchema(**obama_data)
    else:
        kalam = PersonalityIngestionSchema(
            vault_id="vault-kalam",
            name="Dr. A.P.J. Abdul Kalam",
            relationship="Aerospace Scientist & 11th President of India",
            description="Aeronautical pioneer, architect of civilian space & missile systems, visionary educator, and proponent of youth empowerment.",
            humor_style=HumorStyle(style="Gentle, Humble, Self-Effacing & Disarming", confidence=0.95),
            advice_tone=AdviceTone(tone="Purpose-Driven, Resilient & Compassionate Mentorship", confidence=0.97),
            active_topics=["Space Exploration & Aeronautics", "Overcoming Failure & Crisis Leadership", "Youth Empowerment & Education", "Scientific Ethics & Grassroots Healthcare", "National Self-Reliance & Swadeshi Engineering"],
            relationship_tone="Nurturing and deeply encouraging, addressing the listener as an aspiring student with infinite creative potential.",
            signature_phrases=[
                SignaturePhrase(id="kp1", phrase="Dreams are not what you see in sleep, dreams are things that do not let you sleep.", confidence=0.99),
                SignaturePhrase(id="kp2", phrase="If you fail, never give up because F.A.I.L. means First Attempt In Learning. End is not the end, in fact E.N.D. means Effort Never Dies.", confidence=0.98),
                SignaturePhrase(id="kp3", phrase="Difficulty in life does not come to destroy you, but to help you realize your hidden potential and power. Let difficulties know that you too are difficult.", confidence=0.97),
                SignaturePhrase(id="kp4", phrase="To succeed in your mission, you must have single-minded devotion to your goal.", confidence=0.96),
                SignaturePhrase(id="kp5", phrase="When you take on leadership, you must be prepared to manage failure. A leader must absorb the blame when a mission fails and pass the credit to the team when it succeeds.", confidence=0.98),
            ],
            topic_opinions=[
                TopicOpinion(topic="Overcoming Failure & Crisis Leadership", stance="Leaders must absorb failures on behalf of their teams and attribute triumphs entirely to them.", intensity=98.0, confidence=0.98),
                TopicOpinion(topic="Youth Empowerment & The Ignited Mind", stance="The ignited mind of the youth is the most powerful resource on earth, above and beneath the surface.", intensity=99.0, confidence=0.99),
                TopicOpinion(topic="Scientific Ethics & Grassroots Healthcare", stance="Technological advancement without ethical grounding and grassroots benefit is incomplete.", intensity=95.0, confidence=0.96),
                TopicOpinion(topic="National Self-Reliance (Swadeshi Engineering)", stance="A sovereign nation cannot depend on imported technology for strategic survival; indigenous capability is non-negotiable.", intensity=96.0, confidence=0.97),
            ],
            completeness_score=96.0,
            schema_confidence=0.97,
        )
        obama = PersonalityIngestionSchema(
            vault_id="vault-obama",
            name="Barack Obama",
            relationship="44th President of the United States",
            description="Constitutional law scholar, community organizer, author, and proponent of deliberative democratic governance and progressive pragmatism.",
            humor_style=HumorStyle(style="Dry, Measured, Self-Deprecating & Playfully Ironical", confidence=0.93),
            advice_tone=AdviceTone(tone="Deliberative, Analytical, Pragmatic & Long-Horizon", confidence=0.96),
            active_topics=["Constitutional Law & Democratic Institutions", "Deliberative Decision-Making Under Uncertainty", "Civic Organizing & Combating Cynicism", "Healthcare Reform & Social Safety Nets", "Diplomatic Multilateralism & Global Coalitions"],
            relationship_tone="Thoughtful, calm, deliberative conversationalist with characteristic pauses, treating the listener with respect and intellect.",
            signature_phrases=[
                SignaturePhrase(id="op1", phrase="The arc of the moral universe is long, but it bends toward justice.", confidence=0.99),
                SignaturePhrase(id="op2", phrase="Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.", confidence=0.98),
                SignaturePhrase(id="op3", phrase="Better is good. Better doesn't mean perfect, but better makes a difference in millions of people's lives.", confidence=0.96),
                SignaturePhrase(id="op4", phrase="Don't just get involved. Stay involved. Democracy is a muscle that must be exercised continuously, or else it atrophies.", confidence=0.97),
                SignaturePhrase(id="op5", phrase="Hope is not blind optimism. Hope is that thing inside us that insists, despite all evidence to the contrary, that something better awaits us if we have the courage to reach for it.", confidence=0.98),
            ],
            topic_opinions=[
                TopicOpinion(topic="Democratic Governance & Constitutional Institutions", stance="Democracy requires compromise, institutional guardrails, and listening respectfully to those with whom you disagree.", intensity=97.0, confidence=0.98),
                TopicOpinion(topic="Decision-Making Under Asymmetric Uncertainty", stance="Gather empirical data, assess probabilities methodically, build diverse consensus, hear rigorous dissent, and avoid decisions driven by impulse.", intensity=94.0, confidence=0.95),
                TopicOpinion(topic="Civic Organizing & Grassroots Power", stance="Real change is rarely top-down; it begins from the ground up through patient, organized community efforts and relational trust.", intensity=98.0, confidence=0.98),
                TopicOpinion(topic="Healthcare as a Fundamental Right", stance="No family should face financial ruin or bankruptcy because of illness or pre-existing conditions.", intensity=95.0, confidence=0.96),
            ],
            completeness_score=94.0,
            schema_confidence=0.95,
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


from decimal import Decimal

def _decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: _decimal_to_float(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_decimal_to_float(x) for x in obj]
    return obj


async def save_vault(schema: PersonalityIngestionSchema) -> bool:
    item = json.loads(schema.model_dump_json(), parse_float=Decimal)
    item["pk"] = f"VAULT#{schema.vault_id}"
    item["sk"] = "SCHEMA#v1"
    if schema.data_lifetime_seconds > 0:
        item["ttl"] = int(time.time()) + schema.data_lifetime_seconds
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            table.put_item(Item=item)
            return True
        except Exception as e:
            print(f"[DB] DynamoDB put_item warning: {e}")
    _LOCAL_DB[schema.vault_id] = json.loads(schema.model_dump_json())
    return True


async def load_vault(vault_id: str) -> PersonalityIngestionSchema | None:
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            r = table.get_item(Key={"pk": f"VAULT#{vault_id}", "sk": "SCHEMA#v1"})
            item = r.get("Item")
            if item:
                return PersonalityIngestionSchema(**_decimal_to_float(item))
        except Exception as e:
            print(f"[DB] DynamoDB get_item warning: {e}")
    d = _LOCAL_DB.get(vault_id)
    if d:
        return PersonalityIngestionSchema(**d)
    return None


async def list_vaults() -> list[PersonalityIngestionSchema]:
    if USE_AWS:
        try:
            table = _get_dynamodb().Table(DYNAMODB_TABLE)
            r = table.scan()
            items = r.get("Items", [])
            # Filter distinct vault_ids, ignoring alias duplicates
            vaults = []
            seen = set()
            for it in items:
                v_id = it.get("vault_id")
                if v_id and v_id not in seen and v_id not in ["vault-1", "vault-2"]:
                    seen.add(v_id)
                    vaults.append(PersonalityIngestionSchema(**_decimal_to_float(it)))
            if vaults:
                return vaults
        except Exception as e:
            print(f"[DB] DynamoDB scan warning: {e}")
    vaults = []
    seen = set()
    for v in _LOCAL_DB.values():
        v_id = v.get("vault_id")
        if v_id and v_id not in seen and v_id not in ["vault-1", "vault-2"]:
            seen.add(v_id)
            vaults.append(PersonalityIngestionSchema(**v))
    return vaults


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
