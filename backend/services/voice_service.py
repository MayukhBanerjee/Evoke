"""
Voice Service — ElevenLabs Neural Voice Cloning with Amazon Polly Neural TTS Fallback.
Provides dual-pipeline voice synthesis ensuring zero-downtime even under zero quota.
"""
import httpx
import base64
from config import ELEVENLABS_API_KEY
from services.polly_service import synthesize_polly_speech


async def clone_voice(audio_bytes: bytes, name: str) -> str:
    """Clone voice from audio bytes. Returns ElevenLabs voice_id."""
    if not ELEVENLABS_API_KEY:
        return ""
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                "https://api.elevenlabs.io/v1/voices/add",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
                files={"files": (f"{name}.mp3", audio_bytes, "audio/mpeg")},
                data={"name": name, "description": f"Evoke voice clone for {name}"},
            )
            if r.status_code == 200:
                return r.json().get("voice_id", "")
    except Exception as e:
        print(f"ElevenLabs clone error: {e}")
    return ""


async def synthesize_speech(
    text: str,
    voice_id: str = "",
    polly_voice: str = "Matthew"
) -> tuple[bytes, str]:
    """
    Returns (audio_bytes, engine_used).
    Attempts ElevenLabs cloned voice first; falls back seamlessly to Amazon Polly Neural TTS.
    """
    # 1. Primary: ElevenLabs Cloned Voice
    if ELEVENLABS_API_KEY and voice_id:
        try:
            async with httpx.AsyncClient(timeout=25) as client:
                r = await client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"},
                    json={
                        "text": text,
                        "model_id": "eleven_multilingual_v2",
                        "voice_settings": {"stability": 0.5, "similarity_boost": 0.85},
                    },
                )
                if r.status_code == 200 and r.content:
                    return r.content, "elevenlabs"
        except Exception as e:
            print(f"ElevenLabs synthesis warning: {e}, falling back to Amazon Polly")

    # 2. Secondary Fallback: Amazon Polly Neural TTS
    polly_bytes = await synthesize_polly_speech(text, voice_id=polly_voice)
    if polly_bytes:
        return polly_bytes, "amazon-polly"

    return b"", "none"


def audio_to_data_url(audio_bytes: bytes) -> str:
    """Converts audio bytes to base64 data URL."""
    if not audio_bytes:
        return ""
    b64 = base64.b64encode(audio_bytes).decode('ascii')
    return f"data:audio/mpeg;base64,{b64}"
