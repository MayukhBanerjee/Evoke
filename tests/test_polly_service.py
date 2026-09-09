"""
Unit Tests: Amazon Polly Speech Synthesis & Audio Pipeline.
Verifies:
1. Audio to Data URL conversion works correctly for base64 MP3 playback.
2. Dual voice engine fallback behavior is resilient and returns engine indicator.
"""
import sys
import asyncio
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.polly_service import audio_to_data_url
from services.voice_service import synthesize_speech

def test_audio_to_data_url():
    """Verify base64 audio data URL conversion."""
    sample_bytes = b"ID3v2_mock_mp3_audio_frame"
    data_url = audio_to_data_url(sample_bytes)
    assert data_url.startswith("data:audio/mpeg;base64,")
    assert len(data_url) > len("data:audio/mpeg;base64,")


def test_voice_synthesis_fallback():
    """Verify that synthesize_speech returns an audio tuple with fallback indicator."""
    audio_bytes, engine_used = asyncio.run(synthesize_speech("Hello test", voice_id="nonexistent"))
    assert isinstance(audio_bytes, bytes)
    assert engine_used in ["elevenlabs", "amazon-polly", "none"]
