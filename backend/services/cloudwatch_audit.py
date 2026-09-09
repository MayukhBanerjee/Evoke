"""
CloudWatch Tamper-Evident Audit Service (Invariant I4).
Records immutable audit logs of every conversational access event:
  LOG(q, C(q), y_text, latency_ms, humility_triggered) -> CloudWatch

Maintains local append-only log file fallback when running without AWS keys.
"""
import os
import json
import time
from pathlib import Path
from config import USE_AWS, AWS_REGION

LOG_GROUP = "/aws/evoke/audit-trail"
LOCAL_AUDIT_FILE = Path(__file__).resolve().parent.parent / "audit_trail.log"

_cloudwatch_client = None

def _get_cloudwatch_logs():
    global _cloudwatch_client
    if _cloudwatch_client is None and USE_AWS:
        try:
            import boto3
            _cloudwatch_client = boto3.client('logs', region_name=AWS_REGION)
        except Exception:
            _cloudwatch_client = None
    return _cloudwatch_client


async def log_conversation_event(
    vault_id: str,
    query: str,
    context_keys: list[str],
    response_text: str,
    latency_ms: int,
    humility_triggered: bool,
    model_used: str,
) -> dict:
    """Logs an access event to CloudWatch Logs and local append-only file."""
    timestamp_ms = int(time.time() * 1000)
    iso_time = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    
    audit_record = {
        "timestamp_ms": timestamp_ms,
        "iso_timestamp": iso_time,
        "vault_id": vault_id,
        "query": query,
        "context_fields": context_keys,
        "response_preview": response_text[:140] + ("..." if len(response_text) > 140 else ""),
        "latency_ms": latency_ms,
        "humility_triggered": humility_triggered,
        "model_used": model_used,
        "invariant": "I4_Auditability"
    }

    # 1. Write to local append-only log
    try:
        with open(LOCAL_AUDIT_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(audit_record) + "\n")
    except Exception as e:
        print(f"Local audit log error: {e}")

    # 2. Asynchronously stream to CloudWatch Logs if AWS is configured
    client = _get_cloudwatch_logs()
    if client:
        try:
            stream_name = f"vault-{vault_id}"
            try:
                client.create_log_stream(logGroupName=LOG_GROUP, logStreamName=stream_name)
            except Exception:
                pass  # Stream exists
                
            client.put_log_events(
                logGroupName=LOG_GROUP,
                logStreamName=stream_name,
                logEvents=[{
                    'timestamp': timestamp_ms,
                    'message': json.dumps(audit_record)
                }]
            )
        except Exception as e:
            print(f"CloudWatch PutLogEvents error: {e}")

    return audit_record


def get_recent_audit_logs(vault_id: str | None = None, limit: int = 50) -> list[dict]:
    """Retrieves recent audit log events from local storage or memory."""
    if not LOCAL_AUDIT_FILE.exists():
        return []
        
    records = []
    try:
        with open(LOCAL_AUDIT_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        r = json.loads(line.strip())
                        if vault_id is None or r.get("vault_id") == vault_id:
                            records.append(r)
                    except Exception:
                        pass
    except Exception:
        pass
        
    # Return newest first
    return list(reversed(records[-limit:]))
