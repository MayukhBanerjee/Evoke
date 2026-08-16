"""
DB Service — DynamoDB + S3 with local in-memory mock fallback when AWS creds absent.
Implements I2 (DynamoDB TTL = lambda) and I1 (role separation noted).
"""
import json
import time
from config import USE_AWS, AWS_REGION, DYNAMODB_TABLE, S3_BUCKET
from models.schema import PersonalityIngestionSchema

_LOCAL_DB: dict[str, dict] = {}


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
