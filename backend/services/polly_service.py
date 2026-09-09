"""
Amazon Polly Speech Synthesis Service.
Zero-cost, free-tier TTS engine used to conserve ElevenLabs quota or as primary fallback.
Provides Neural voices (e.g., Matthew, Joanna, Aditi, Raveena) via boto3 polly client.
"""
import io
import base64
from config import USE_AWS, AWS_REGION

_polly_client = None

def _get_polly():
    global _polly_client
    if _polly_client is None and USE_AWS:
        try:
            import boto3
            _polly_client = boto3.client('polly', region_name=AWS_REGION)
        except Exception:
            _polly_client = None
    return _polly_client


async def synthesize_polly_speech(
    text: str,
    voice_id: str = "Matthew",
    engine: str = "neural",
) -> bytes:
    """Synthesizes speech using Amazon Polly and returns MP3 bytes."""
    client = _get_polly()
    if client:
        try:
            # Neural engine supports Matthew, Joanna, Lupe, Amy, etc.
            response = client.synthesize_speech(
                Text=text[:3000],
                OutputFormat="mp3",
                VoiceId=voice_id,
                Engine=engine,
            )
            if "AudioStream" in response:
                return response["AudioStream"].read()
        except Exception as e:
            # If neural engine is unavailable for specific voice, retry with standard
            try:
                response = client.synthesize_speech(
                    Text=text[:3000],
                    OutputFormat="mp3",
                    VoiceId=voice_id,
                    Engine="standard",
                )
                if "AudioStream" in response:
                    return response["AudioStream"].read()
            except Exception as e2:
                print(f"Polly synthesis fallback error: {e2}")

    # Fallback to empty bytes if AWS is not configured
    return b""


def audio_to_data_url(audio_bytes: bytes) -> str:
    """Converts MP3 bytes to browser-playable base64 Data URL."""
    if not audio_bytes:
        return ""
    b64 = base64.b64encode(audio_bytes).decode('ascii')
    return f"data:audio/mpeg;base64,{b64}"
