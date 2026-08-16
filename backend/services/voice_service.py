"""
Voice Service — ElevenLabs voice cloning and TTS with Amazon Polly fallback.
"""
import httpx
import base64
from config import ELEVENLABS_API_KEY


async def clone_voice(audio_bytes: bytes, name: str) -> str:
    """Clone voice from audio bytes. Returns ElevenLabs voice_id."""
    if not ELEVENLABS_API_KEY:
        return ""
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            "https://api.elevenlabs.io/v1/voices/add",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            files={"files": (f"{name}.mp3", audio_bytes, "audio/mpeg")},
            data={"name": name, "description": f"Evoke voice clone for {name}"},
        )
        if r.status_code == 200:
            return r.json().get("voice_id", "")
    return ""


async def synthesize_speech(text: str, voice_id: str) -> bytes:
    """Returns MP3 audio bytes for the given text using cloned voice."""
    if not ELEVENLABS_API_KEY or not voice_id:
        return b""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"},
            json={
                "text": text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.85},
            },
        )
        if r.status_code == 200:
            return r.content
    return b""


def audio_to_data_url(audio_bytes: bytes) -> str:
    if not audio_bytes:
        return ""
    b64 = base64.b64encode(audio_bytes).decode()
    return f"data:audio/mpeg;base64,{b64}"
