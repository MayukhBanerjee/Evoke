"""
LLM Engine — AWS Bedrock Mantle (DeepSeek V3.2) primary with multi-tier failover.
Uses a first-person inner-monologue prompt architecture with live session context injection,
dynamic temperature routing, and semantically-guided phrase selection (Section IV, Phase 3).
"""
import time
import json
import asyncio
import httpx
import boto3
from config import (
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    GROQ_API_KEY,
    GEMINI_API_KEY,
    GROQ_MODEL,
    GEMINI_MODEL,
    USE_BEDROCK,
    BEDROCK_REGION,
    BEDROCK_MODEL_ID,
    BEDROCK_MANTLE_API_KEY,
    BEDROCK_MANTLE_ENDPOINT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    USE_AWS,
)


def get_dynamic_temperature(query_confidence: float, query: str = "") -> float:
    """
    Returns a context-appropriate temperature.
    - Humility gate territory (conf < 0.70): calm, measured → 0.60
    - Personal reflection / memory queries:  exploratory   → 0.82
    - Advice / decision queries:             deliberate    → 0.68
    - Default conversational:                              → 0.75
    """
    if query_confidence < 0.70:
        return 0.60
    q = query.lower()
    reflective = ["remember", "think back", "how did you", "when you", "story", "time when",
                  "feel", "felt", "what was it like", "your experience"]
    advisory = ["should i", "what should", "how do i", "advise", "help me decide",
                "guide me", "tell me what to do", "what would you do"]
    if any(w in q for w in reflective):
        return 0.82
    if any(w in q for w in advisory):
        return 0.68
    return 0.75


def build_system_prompt(schema, query: str = None, history: list[dict] = None) -> str:
    """
    Builds a first-person inner-monologue system prompt grounded in:
    - Live session context (topics, self-disclosures, emotional arc)
    - Semantically selected 1-2 signature phrases (deduplicated across session)
    - Natural stances phrased as the person's own convictions
    """
    from services.session_context import (
        extract_session_state, build_session_block, select_relevant_phrases
    )

    # ── Session context ────────────────────────────────────────────────────
    session_state = extract_session_state(history or [], schema)
    session_block = build_session_block(session_state, schema)

    # ── Phrase selection: 1-2 relevant, not already used this session ─────
    relevant_phrases = select_relevant_phrases(
        query or "", schema, session_state.used_phrases, max_count=2
    )
    if relevant_phrases:
        phrase_block = (
            "A phrase from my own life that captures how I actually think:\n"
            + "\n".join(f'"{p}"' for p in relevant_phrases)
        )
    else:
        phrase_block = ""

    # ── Topic stances written as first-person convictions ─────────────────
    stance_lines = []
    for o in getattr(schema, "topic_opinions", [])[:5]:
        detail_note = f" — {o.detail[:90]}" if getattr(o, "detail", "") else ""
        stance_lines.append(f"On {o.topic}: {o.stance}{detail_note}")
    stances_block = "\n".join(stance_lines) if stance_lines else "My deepest values guide every word I speak."

    # ── Supporting fields ─────────────────────────────────────────────────
    topics = ", ".join(getattr(schema, "active_topics", [])[:5]) or "life, purpose, and what matters"
    relationship = getattr(schema, "relationship", "someone I care about")
    rel_tone = getattr(schema, "relationship_tone", "With warmth and genuine attention.")
    humor_style = getattr(schema.humor_style, "style", "natural") if hasattr(schema, "humor_style") else "natural"
    advice_tone = getattr(schema.advice_tone, "tone", "thoughtful and direct") if hasattr(schema, "advice_tone") else "thoughtful"
    description = schema.description or ""

    # ── Opening register based on where we are in the conversation ────────
    if session_state.turn_count == 0:
        opening_register = (
            "This is the start of our conversation. "
            "I want to hear what is truly on your mind before I say too much."
        )
    elif session_state.turn_count >= 8:
        opening_register = "We have been talking for a while. I can speak more candidly and personally now."
    else:
        opening_register = ""

    # ── Session continuity block ──────────────────────────────────────────
    session_insertion = f"\n\n{session_block}" if session_block else ""

    return f"""I am {schema.name}. {description}

The person I am speaking with is my {relationship}. {rel_tone}{session_insertion}
{opening_register}

My characteristic voice and approach:
My sense of humor is {humor_style} — it surfaces when the moment calls for it, never performed.
When it comes to guidance, my instinct is: {advice_tone}. I speak from what I have actually lived, not from abstract principle.

What I know deeply and believe in:
{stances_block}

The domains I think about most: {topics}.

{phrase_block}

How I hold myself in this conversation:
I speak as myself — in first person, with the texture of real thought, not a summary of my biography.
I respond as I would in genuine conversation: grounded, direct, usually 3 to 5 sentences.
I never say "As an AI..." or step outside of who I am.
When something is beyond my world or my time, I say so honestly from within my own perspective — I do not manufacture certainty I never had."""


async def call_openrouter(system_prompt: str, message: str, history: list[dict], temperature: float = 0.75) -> tuple[str, int]:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not configured")

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": message})

    start = time.time()
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Evoke Personality Legacy",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": messages,
                "max_tokens": 480,
                "temperature": temperature,
            },
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    data = r.json()
    text = data["choices"][0]["message"]["content"].strip()
    return text, latency


async def call_groq(system_prompt: str, message: str, history: list[dict], temperature: float = 0.75) -> tuple[str, int]:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured")

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": message})

    start = time.time()
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": messages, "max_tokens": 480, "temperature": temperature},
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    return r.json()["choices"][0]["message"]["content"].strip(), latency


async def call_gemini(system_prompt: str, message: str, temperature: float = 0.75) -> tuple[str, int]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    full_prompt = f"{system_prompt}\n\nPerson speaking with me: {message}\n\nMy response:"
    start = time.time()
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": full_prompt}]}],
                "generationConfig": {"temperature": temperature, "maxOutputTokens": 480},
            },
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    text = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    return text, latency


def _sync_invoke_bedrock(system_prompt: str, message: str, history: list[dict], temperature: float = 0.75) -> str:
    _bedrock_temperature = temperature
    session_kwargs = {}
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        session_kwargs["aws_access_key_id"] = AWS_ACCESS_KEY_ID
        session_kwargs["aws_secret_access_key"] = AWS_SECRET_ACCESS_KEY
    if BEDROCK_REGION:
        session_kwargs["region_name"] = BEDROCK_REGION

    client = boto3.client("bedrock-runtime", **session_kwargs)

    # 1. Primary Modern Approach: AWS Bedrock Converse API (Universal across DeepSeek, Llama, Claude, Nova)
    try:
        converse_messages = []
        for h in history[-6:]:
            role = "user" if h.get("role") == "user" else "assistant"
            converse_messages.append({
                "role": role,
                "content": [{"text": h.get("content", "")}]
            })
        converse_messages.append({
            "role": "user",
            "content": [{"text": message}]
        })

        response = client.converse(
            modelId=BEDROCK_MODEL_ID,
            messages=converse_messages,
            system=[{"text": system_prompt}],
            inferenceConfig={
                "maxTokens": 480,
                "temperature": _bedrock_temperature,
                "topP": 0.92,
            },
        )
        return response["output"]["message"]["content"][0]["text"].strip()
    except Exception as conv_err:
        # Fallback to model-specific invoke_model if converse API is not supported on custom endpoints
        pass

    # 2. Model-Specific invoke_model Fallbacks
    # DeepSeek / OpenAI-compatible payload
    if "deepseek" in BEDROCK_MODEL_ID.lower():
        msgs = [{"role": "system", "content": system_prompt}]
        for h in history[-6:]:
            msgs.append({"role": h.get("role", "user"), "content": h.get("content", "")})
        msgs.append({"role": "user", "content": message})
        body = json.dumps({
            "messages": msgs,
            "max_tokens": 480,
            "temperature": temperature,
        })
        response = client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=body,
        )
        data = json.loads(response["body"].read().decode("utf-8"))
        if "choices" in data:
            return data["choices"][0]["message"]["content"].strip()
        elif "generation" in data:
            return data["generation"].strip()
        return str(data)

    # Format for Claude models if specified in BEDROCK_MODEL_ID
    if "anthropic" in BEDROCK_MODEL_ID.lower():
        msgs = []
        for h in history[-8:]:
            role = "user" if h.get("role") == "user" else "assistant"
            msgs.append({"role": role, "content": h.get("content", "")})
        msgs.append({"role": "user", "content": message})
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 480,
            "system": system_prompt,
            "messages": msgs,
            "temperature": temperature,
        })
        response = client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=body,
        )
        data = json.loads(response["body"].read().decode("utf-8"))
        return data["content"][0]["text"].strip()

    # Meta Llama 3 / 3.1 / 3.3 Prompt Format
    prompt_text = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
    for h in history[-8:]:
        role = h.get("role", "user")
        content = h.get("content", "")
        prompt_text += f"\n<|start_header_id|>{role}<|end_header_id|>\n\n{content}<|eot_id|>"
    prompt_text += f"\n<|start_header_id|>user<|end_header_id|>\n\n{message}<|eot_id|>\n<|start_header_id|>assistant<|end_header_id|>\n\n"

    body = json.dumps({
        "prompt": prompt_text,
        "max_gen_len": 480,
        "temperature": temperature,
        "top_p": 0.92,
    })

    response = client.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=body,
    )
    data = json.loads(response["body"].read().decode("utf-8"))
    return data["generation"].strip()


async def call_bedrock(system_prompt: str, message: str, history: list[dict], temperature: float = 0.75) -> tuple[str, int]:
    start = time.time()
    text = await asyncio.to_thread(_sync_invoke_bedrock, system_prompt, message, history, temperature)
    latency = int((time.time() - start) * 1000)
    return text, latency


async def call_bedrock_mantle(system_prompt: str, message: str, history: list[dict], temperature: float = 0.75) -> tuple[str, int]:
    """Invokes DeepSeek V3.2 or other models hosted on AWS Bedrock Mantle Endpoint."""
    if not BEDROCK_MANTLE_API_KEY:
        raise RuntimeError("BEDROCK_MANTLE_API_KEY not set")

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-8:]:
        role = "user" if h.get("role") == "user" else "assistant"
        messages.append({"role": role, "content": h.get("content", "")})
    messages.append({"role": "user", "content": message})

    start = time.time()
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            BEDROCK_MANTLE_ENDPOINT,
            headers={
                "Authorization": f"Bearer {BEDROCK_MANTLE_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": BEDROCK_MODEL_ID,
                "messages": messages,
                "max_tokens": 480,
                "temperature": temperature,
            },
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    data = r.json()
    text = data["choices"][0]["message"]["content"].strip()
    return text, latency


async def generate_echo(
    schema,
    message: str,
    system_prompt: str,
    history: list[dict],
    query_confidence: float = 0.80,
) -> tuple[str, int, str]:
    """
    Returns (text, latency_ms, model_used).
    Cascade: Bedrock Mantle (DeepSeek V3.2) -> Bedrock Boto3 -> OpenRouter -> Groq -> Gemini -> Fallback.
    Temperature is dynamically computed from query_confidence and message content.
    """
    temp = get_dynamic_temperature(query_confidence, message)

    if BEDROCK_MANTLE_API_KEY:
        try:
            text, latency = await call_bedrock_mantle(system_prompt, message, history, temp)
            return text, latency, f"bedrock-mantle/{BEDROCK_MODEL_ID}"
        except Exception as e:
            print(f"[LLM Engine] Bedrock Mantle ({BEDROCK_MODEL_ID}) error, attempting failover: {e}")

    if USE_BEDROCK and (USE_AWS or BEDROCK_REGION):
        try:
            text, latency = await call_bedrock(system_prompt, message, history, temp)
            return text, latency, f"bedrock/{BEDROCK_MODEL_ID}"
        except Exception as e:
            print(f"[LLM Engine] Amazon Bedrock error, attempting failover: {e}")

    if OPENROUTER_API_KEY:
        try:
            text, latency = await call_openrouter(system_prompt, message, history, temp)
            return text, latency, OPENROUTER_MODEL
        except Exception as e:
            print(f"[LLM Engine] OpenRouter error, attempting failover: {e}")

    if GROQ_API_KEY:
        try:
            text, latency = await call_groq(system_prompt, message, history, temp)
            return text, latency, GROQ_MODEL
        except Exception as e:
            print(f"[LLM Engine] Groq error, attempting failover: {e}")

    if GEMINI_API_KEY:
        try:
            text, latency = await call_gemini(system_prompt, message, temp)
            return text, latency, GEMINI_MODEL
        except Exception as e:
            print(f"[LLM Engine] Gemini error: {e}")

    # Graceful persona-grounded offline fallback
    phrases = getattr(schema, "signature_phrases", [])
    first_phrase = phrases[0].phrase if phrases else ""
    return (
        f"I find myself without the tools to reach you properly right now — "
        f"but the principles I have always held remain. "
        f"{'As I have said before: ' + chr(34) + first_phrase + chr(34) if first_phrase else ''}",
        0,
        "local-fallback",
    )
