from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime


class BehavioralField(BaseModel):
    key: str
    value: str
    evidence: str = ""
    confidence: float = Field(ge=0.0, le=1.0, default=0.5)


class SignaturePhrase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phrase: str
    context: str = ""
    confidence: float = Field(ge=0.0, le=1.0, default=0.9)


class TopicOpinion(BaseModel):
    topic: str
    stance: str
    intensity: float = Field(ge=0.0, le=100.0, default=70.0)
    detail: str = ""
    confidence: float = Field(ge=0.0, le=1.0, default=0.75)


class HumorStyle(BaseModel):
    style: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)


class AdviceTone(BaseModel):
    tone: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)


class PersonalityIngestionSchema(BaseModel):
    """
    Formal PIS: S(p) = (F, c, tau, lambda)
    F = set of typed behavioral fields with confidence scores
    c: F -> [0,1] confidence function
    tau = epistemic humility threshold (0.70)
    lambda = data lifetime (TTL seconds)
    """
    vault_id: str = Field(default_factory=lambda: f"vault-{uuid.uuid4().hex[:8]}")
    name: str
    relationship: str
    description: str = ""
    humor_style: HumorStyle
    advice_tone: AdviceTone
    active_topics: list[str] = []
    relationship_tone: str = ""
    signature_phrases: list[SignaturePhrase] = []
    topic_opinions: list[TopicOpinion] = []
    completeness_score: float = Field(ge=0.0, le=100.0, default=0.0)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    last_conversation_date: str = ""
    voice_sample_url: str = ""
    elevenlabs_voice_id: str = ""
    data_lifetime_seconds: int = Field(default=0, description="lambda: 0 = indefinite")
    # raw confidence aggregate across all fields
    schema_confidence: float = Field(ge=0.0, le=1.0, default=0.0)


class OnboardRequest(BaseModel):
    name: str
    relationship: str
    description: str = ""
    prompt_responses: dict[str, str] = {}
    has_chat_export: bool = False
    has_letters: bool = False
    audio_file_name: str = ""


class ConversationRequest(BaseModel):
    vault_id: str
    message: str
    conversation_history: list[dict] = []


class ConversationResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    text: str
    audio_url: str = ""
    latency_ms: int = 0
    humility_triggered: bool = False
    schema_confidence: float = 0.0
    model_used: str = ""

