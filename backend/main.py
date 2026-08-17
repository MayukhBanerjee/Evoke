"""
Evoke FastAPI Backend — main entry point.
Endpoints: POST /api/vault/onboard, GET /api/vault/{id}, GET /api/vaults,
           POST /api/converse, GET /api/evaluation/results
"""
import sys
from pathlib import Path

# Ensure backend directory is in sys.path for robust module resolution
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schema import OnboardRequest, ConversationRequest, ConversationResponse
from services.nlp_extractor import extract_schema_from_onboard
from services.humility_gate import apply_humility_gate
from services.llm_engine import build_system_prompt, generate_echo
from services.voice_service import clone_voice, synthesize_speech, audio_to_data_url
from services.db_service import save_vault, load_vault, list_vaults, upload_audio_s3


app = FastAPI(title="Evoke API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.amplifyapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Evoke Backend"}


@app.post("/api/vault/onboard")
async def onboard_vault(
    name: str = Form(...),
    relationship: str = Form(...),
    description: str = Form(""),
    prompt_responses: str = Form("{}"),
    audio_file: UploadFile | None = File(None),
):
    import json
    responses: dict[str, str] = json.loads(prompt_responses)
    schema = extract_schema_from_onboard(name, relationship, description, responses)

    voice_id = ""
    if audio_file:
        audio_bytes = await audio_file.read()
        audio_url = await upload_audio_s3(schema.vault_id, audio_bytes, audio_file.filename or "voice.mp3")
        schema.voice_sample_url = audio_url
        voice_id = await clone_voice(audio_bytes, name)
        schema.elevenlabs_voice_id = voice_id

    await save_vault(schema)
    return schema


@app.get("/api/vault/{vault_id}")
async def get_vault(vault_id: str):
    schema = await load_vault(vault_id)
    if not schema:
        raise HTTPException(status_code=404, detail="Vault not found")
    return schema


@app.get("/api/vaults")
async def get_vaults():
    return await list_vaults()


@app.post("/api/converse", response_model=ConversationResponse)
async def converse(req: ConversationRequest):
    schema = await load_vault(req.vault_id)
    if not schema:
        raise HTTPException(status_code=404, detail="Vault not found")

    base_prompt = build_system_prompt(schema)
    conditioned_prompt, humility_triggered = apply_humility_gate(req.message, schema, base_prompt)

    t0 = time.time()
    text, llm_latency, model_used = await generate_echo(
        schema, req.message, conditioned_prompt, req.conversation_history
    )
    latency_ms = int((time.time() - t0) * 1000)

    audio_url = ""
    if schema.elevenlabs_voice_id:
        audio_bytes = await synthesize_speech(text, schema.elevenlabs_voice_id)
        audio_url = audio_to_data_url(audio_bytes)

    return ConversationResponse(
        text=text,
        audio_url=audio_url,
        latency_ms=max(latency_ms, llm_latency),
        humility_triggered=humility_triggered,
        schema_confidence=schema.schema_confidence,
        model_used=model_used,
    )


@app.get("/api/evaluation/results")
async def evaluation_results():
    """Returns pre-computed evaluation metrics matching paper Section VI."""
    return {
        "authenticity": {"evoke": 4.21, "baseline": 2.74, "delta": 1.47, "p_value": 0.001, "cohens_d": 1.31},
        "relational_accuracy": {"evoke": 4.02, "baseline": 2.63, "delta": 1.39},
        "uncanny_valley_resistance": {"evoke": 4.11, "baseline": 2.88, "delta": 1.23},
        "fabrication_rate": {"evoke_pct": 2.0, "baseline_pct": 15.3, "reduction_pct": 87.0},
        "retrieval_latency_ms": {"p95": 9.4},
        "groq_ttft_ms": {"max": 800},
        "fleiss_kappa": 0.61,
        "infrastructure_cost_inr": 0,
    }
