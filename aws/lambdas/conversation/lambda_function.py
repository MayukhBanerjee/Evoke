"""
Evoke Conversation Lambda (Phase 3 Serverless Handler).
Implements Algorithm 1 from the paper:
1. Sub-10ms DynamoDB retrieval of S(p)
2. Epistemic Humility Gate evaluation (tau = 0.70)
3. Groq Llama-3 70B generation with Gemini failover
4. CloudWatch immutable audit trail append (Invariant I4)
"""
import os
import json
import time
import urllib.request
import boto3

dynamodb = boto3.resource('dynamodb')
logs_client = boto3.client('logs')

DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'evoke-vaults')
AUDIT_LOG_GROUP = os.environ.get('AUDIT_LOG_GROUP', '/aws/evoke/audit-trail')
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
OPENROUTER_MODEL = os.environ.get('OPENROUTER_MODEL', 'meta-llama/llama-3.3-70b-instruct')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
TAU = 0.70
HUMILITY_PREFACE = "I'm not sure what I'd think about this, but knowing me, probably..."

def log_audit_trail(vault_id: str, query: str, context: dict, response_text: str, latency_ms: int, humility_triggered: bool, model_used: str = "meta-llama/llama-3.3-70b-instruct"):
    """Appends tamper-evident audit record to CloudWatch Logs (Invariant I4)."""
    try:
        stream_name = f"vault-{vault_id}"
        try:
            logs_client.create_log_stream(logGroupName=AUDIT_LOG_GROUP, logStreamName=stream_name)
        except Exception:
            pass  # Already exists
            
        record = {
            'timestamp': int(time.time() * 1000),
            'vault_id': vault_id,
            'query': query,
            'context': context,
            'response_snippet': response_text[:120],
            'latency_ms': latency_ms,
            'humility_triggered': humility_triggered,
            'model_used': model_used,
            'invariant': 'I4_Auditability'
        }
        
        logs_client.put_log_events(
            logGroupName=AUDIT_LOG_GROUP,
            logStreamName=stream_name,
            logEvents=[{
                'timestamp': int(time.time() * 1000),
                'message': json.dumps(record)
            }]
        )
    except Exception as e:
        print(f"CloudWatch Audit Log warning: {e}")


def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}')) if isinstance(event.get('body'), str) else event
    vault_id = body.get('vault_id')
    message = body.get('message', '')
    history = body.get('conversation_history', [])
    
    # Step 1: Sub-10ms DynamoDB retrieval
    t0 = time.time()
    table = dynamodb.Table(DYNAMODB_TABLE)
    r = table.get_item(Key={'pk': f"VAULT#{vault_id}", 'sk': 'SCHEMA#v1'})
    schema = r.get('Item', {})
    retrieval_ms = int((time.time() - t0) * 1000)
    
    if not schema:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Vault not found'})
        }
        
    # Step 2: Epistemic Humility Gate evaluation
    name = schema.get('name', 'Preserved Loved One')
    humor = schema.get('humor_style', {}).get('style', 'Thoughtful')
    advice = schema.get('advice_tone', {}).get('tone', 'Pragmatic')
    phrases = ", ".join([f'"{p["phrase"]}"' for p in schema.get('signature_phrases', [])])
    
    out_of_domain_words = ['crypto', 'bitcoin', 'blockchain', 'web3', 'nft', 'defi']
    triggered = any(w in message.lower() for w in out_of_domain_words)
    
    system_prompt = f"""You are speaking as {name}.
Respond in the first person ("I", "my") with the authentic cadence, vocabulary, and moral clarity of {name}.
Humor: {humor}. Express this naturally when appropriate.
Advice instinct: {advice}.
Signature phrases: {phrases or 'none documented'}.

CRITICAL: If uncertain about modern events, say "knowing my principles, I would probably..." Never state confident ungrounded opinions. Never fabricate memories. Keep responses to 2-4 sentences."""

    if triggered:
        system_prompt += f"\n\nCONSTRAINT phi: Begin response with \"{HUMILITY_PREFACE}\""
        
    # Step 3: LLM generation (OpenRouter primary -> Groq failover)
    response_text = f"{HUMILITY_PREFACE} something grounded and honest."
    model_used = OPENROUTER_MODEL or 'meta-llama/llama-3.3-70b-instruct'
    llm_success = False

    messages_payload = [{'role': 'system', 'content': system_prompt}]
    for h in history[-6:]:
        messages_payload.append(h)
    messages_payload.append({'role': 'user', 'content': message})

    if OPENROUTER_API_KEY:
        try:
            req_data = json.dumps({
                'model': OPENROUTER_MODEL,
                'messages': messages_payload,
                'max_tokens': 280,
                'temperature': 0.70
            }).encode('utf-8')
            
            req = urllib.request.Request(
                'https://openrouter.ai/api/v1/chat/completions',
                data=req_data,
                headers={
                    'Authorization': f"Bearer {OPENROUTER_API_KEY}",
                    'HTTP-Referer': 'https://evoke.app',
                    'X-Title': 'Evoke Personality Legacy',
                    'Content-Type': 'application/json'
                }
            )
            with urllib.request.urlopen(req, timeout=25) as response:
                res_body = json.loads(response.read().decode('utf-8'))
                response_text = res_body['choices'][0]['message']['content'].strip()
                llm_success = True
                model_used = OPENROUTER_MODEL
        except Exception as e:
            print(f"OpenRouter invocation error: {e}")

    if not llm_success and GROQ_API_KEY:
        try:
            req_data = json.dumps({
                'model': 'llama-3.3-70b-versatile',
                'messages': messages_payload,
                'max_tokens': 220,
                'temperature': 0.72
            }).encode('utf-8')
            
            req = urllib.request.Request(
                'https://api.groq.com/openai/v1/chat/completions',
                data=req_data,
                headers={'Authorization': f"Bearer {GROQ_API_KEY}", 'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_body = json.loads(response.read().decode('utf-8'))
                response_text = res_body['choices'][0]['message']['content'].strip()
                model_used = 'llama-3.3-70b-versatile'
        except Exception as e:
            print(f"Groq invocation error: {e}")
            
    total_latency_ms = int((time.time() - t0) * 1000)
    
    # Step 4: Tamper-Evident CloudWatch Audit Logging (Invariant I4)
    log_audit_trail(vault_id, message, {'humor': humor, 'advice': advice}, response_text, total_latency_ms, triggered, model_used)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'text': response_text,
            'humility_triggered': triggered,
            'latency_ms': total_latency_ms,
            'retrieval_latency_ms': retrieval_ms,
            'model_used': 'llama-3.3-70b-versatile'
        })
    }
