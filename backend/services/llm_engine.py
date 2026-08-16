"""
LLM Engine — Groq Llama-3.3-70B primary with Google Gemini 1.5 Flash failover.
Uses the exact schema-conditioned prompt template from the Evoke paper (Section IV, Phase 3).
"""
import time
import httpx
from config import GROQ_API_KEY, GEMINI_API_KEY, GROQ_MODEL, GEMINI_MODEL


def build_system_prompt(schema) -> str:
    phrases = ", ".join(f'"{p.phrase}"' for p in schema.signature_phrases) or "none documented"
    topics = ", ".join(schema.active_topics) or "general life topics"
    return f"""You are responding as {schema.name}.
Humor: You are {schema.humor_style.style}. Express this when it feels natural, never forced.
Advice: When asked for guidance, your instinct is {schema.advice_tone.tone}.
Your phrases: {phrases} — use these naturally across conversation.
Speaking to this specific person, your tone is {schema.relationship_tone or "warm and personal"}.
Active topics you care about: {topics}.

CRITICAL: If uncertain what you would think about something, say "knowing me, I'd probably..." — never state confident opinions you may not have held. Never fabricate memories. Keep responses to 2-4 sentences."""


async def call_groq(system_prompt: str, message: str, history: list[dict]) -> tuple[str, int]:
    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:
        messages.append(h)
    messages.append({"role": "user", "content": message})

    start = time.time()
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": messages, "max_tokens": 220, "temperature": 0.72},
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
    """Returns (text, latency_ms, model_used). Tries Groq first, falls back to Gemini."""
    try:
        text, latency = await call_groq(system_prompt, message, history)
        return text, latency, GROQ_MODEL
    except Exception:
        pass
    try:
        text, latency = await call_gemini(system_prompt, message)
        return text, latency, GEMINI_MODEL
    except Exception:
        return "I'm not sure what I'd think about this right now, but knowing me, probably something thoughtful.", 0, "fallback"
