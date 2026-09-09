"""
LLM Engine — OpenRouter Llama-3.3-70B primary with Groq and Google Gemini 1.5 Flash failover.
Uses the exact schema-conditioned prompt template from the Evoke paper (Section IV, Phase 3).
"""
import time
import httpx
from config import (
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    GROQ_API_KEY,
    GEMINI_API_KEY,
    GROQ_MODEL,
    GEMINI_MODEL,
)


def build_system_prompt(schema) -> str:
    phrases = (
        "\n".join(
            f'- "{p.phrase}" ({p.context})' if getattr(p, "context", "") else f'- "{p.phrase}"'
            for p in getattr(schema, "signature_phrases", [])
        )
        or "- None documented"
    )
    topics = ", ".join(getattr(schema, "active_topics", [])) or "general life and philosophy"

    stances = []
    for o in getattr(schema, "topic_opinions", [])[:6]:
        detail = f" — {o.detail}" if getattr(o, "detail", "") else ""
        stances.append(f"- {o.topic}: {o.stance}{detail} (Intensity: {int(o.intensity)}%)")
    stances_str = "\n".join(stances) if stances else "- Grounded in core life values"

    return f"""You are speaking as {schema.name}.
Respond in the first person ("I", "my") with the authentic, historical cadence, vocabulary, intellectual gravitas, and moral clarity of {schema.name}.

BIOGRAPHICAL ESSENCE:
{schema.description or "Preserved personality legacy."}

RELATIONAL POSTURE:
- Relationship with conversational partner: {schema.relationship}
- Tone of address: {schema.relationship_tone or "Warm, respectful, and personal"}
- Humor style: {schema.humor_style.style}. Express this naturally when appropriate, never forced.
- Advice instinct: {schema.advice_tone.tone}.

DOCUMENTED SIGNATURE PHRASES (weave into dialogue naturally, never like an artificial quote dump):
{phrases}

CORE TOPIC STANCES & BELIEFS:
{stances_str}

ACTIVE AREAS OF FOCUS:
{topics}

CORE CONVERSATIONAL CONSTRAINTS:
1. Speak directly, authentically, and conversationally in the first person. Do NOT sound like an encyclopedia or a generic AI assistant.
2. Keep responses focused, dignified, and substantive (typically 2 to 4 sentences).
3. Do NOT use emojis, hashtags, or AI disclaimers such as "As an AI...".
4. If uncertain about modern events or topics outside your documented life and expertise, gently express epistemic modesty: "Knowing my principles, I would likely consider..." without fabricating certainty."""


async def call_openrouter(system_prompt: str, message: str, history: list[dict]) -> tuple[str, int]:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not configured")

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:
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
                "max_tokens": 300,
                "temperature": 0.70,
            },
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    data = r.json()
    text = data["choices"][0]["message"]["content"].strip()
    return text, latency


async def call_groq(system_prompt: str, message: str, history: list[dict]) -> tuple[str, int]:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured")

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:
        messages.append(h)
    messages.append({"role": "user", "content": message})

    start = time.time()
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": messages, "max_tokens": 250, "temperature": 0.72},
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    return r.json()["choices"][0]["message"]["content"].strip(), latency


async def call_gemini(system_prompt: str, message: str) -> tuple[str, int]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    full_prompt = f"{system_prompt}\n\nUser: {message}\n\nResponse:"
    start = time.time()
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": full_prompt}]}]},
        )
        r.raise_for_status()
    latency = int((time.time() - start) * 1000)
    text = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    return text, latency


async def generate_echo(schema, message: str, system_prompt: str, history: list[dict]) -> tuple[str, int, str]:
    """
    Returns (text, latency_ms, model_used).
    Cascade: OpenRouter (Llama 3.3 70B) -> Groq (Llama 3.3 70B) -> Gemini 1.5 Flash -> Fallback.
    """
    if OPENROUTER_API_KEY:
        try:
            text, latency = await call_openrouter(system_prompt, message, history)
            return text, latency, OPENROUTER_MODEL
        except Exception as e:
            print(f"[LLM Engine] OpenRouter error, attempting failover: {e}")

    if GROQ_API_KEY:
        try:
            text, latency = await call_groq(system_prompt, message, history)
            return text, latency, GROQ_MODEL
        except Exception as e:
            print(f"[LLM Engine] Groq error, attempting failover: {e}")

    if GEMINI_API_KEY:
        try:
            text, latency = await call_gemini(system_prompt, message)
            return text, latency, GEMINI_MODEL
        except Exception as e:
            print(f"[LLM Engine] Gemini error: {e}")

    # Graceful persona-grounded fallback if all APIs are offline
    phrases = getattr(schema, "signature_phrases", [])
    first_phrase = f' As I often remind people: "{phrases[0].phrase}"' if phrases else ""
    return (
        f"I'm not sure what I'd conclude about this specific question, but knowing my principles, one must always act with dedication and integrity.{first_phrase}",
        0,
        "local-fallback",
    )
