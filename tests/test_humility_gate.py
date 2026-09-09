"""
Unit Tests: Epistemic Humility Gate (Definition 3 & Equation 1).
Verifies:
1. In-domain queries preserve confidence >= 0.70 without triggering humility preface.
2. Out-of-domain queries trigger tau=0.70, injecting preface h and phi constraint.
3. Semantic embedding relevance correctly identifies relevant behavioral keys.
"""
import sys
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
from models.schema import PersonalityIngestionSchema, HumorStyle, AdviceTone, SignaturePhrase, TopicOpinion
from services.humility_gate import apply_humility_gate, TAU, HUMILITY_PREFACE, PHI_CONSTRAINT
from services.embedding_service import compute_semantic_relevance, cosine_similarity

@pytest.fixture
def sample_schema():
    return PersonalityIngestionSchema(
        vault_id="vault-test-kalam",
        name="Dr. A.P.J. Abdul Kalam",
        relationship="Teacher & Mentor",
        humor_style=HumorStyle(style="Gentle, Humble & Self-Effacing", confidence=0.94),
        advice_tone=AdviceTone(tone="Purpose-Driven & Resilient Mentorship", confidence=0.96),
        relationship_tone="Nurturing, humble, addressing the listener as an aspiring student.",
        signature_phrases=[
            SignaturePhrase(phrase="Dreams are not what you see in sleep, dreams are things that do not let you sleep", confidence=0.98),
            SignaturePhrase(phrase="If you fail, never give up because F.A.I.L. means First Attempt In Learning", confidence=0.96),
        ],
        topic_opinions=[
            TopicOpinion(topic="Career & Ambition", stance="Devote single-minded devotion to your mission", confidence=0.94),
            TopicOpinion(topic="Handling Failure", stance="Leaders must absorb failure and attribute success to the team", confidence=0.96),
        ],
        schema_confidence=0.95,
    )


def test_semantic_similarity():
    """Cosine similarity should be high for semantically identical text and low for orthogonal text."""
    high_sim = cosine_similarity("Career decision and work failure", "Career advice and handling failure")
    low_sim = cosine_similarity("Making scientific rockets in aerospace", "Quantum speculative crypto bitcoin nft")
    assert high_sim > 0.40
    assert low_sim < 0.15


def test_in_domain_career_query(sample_schema):
    """In-domain advice query should have confidence >= tau and not trigger humility preface."""
    query = "Dr. Kalam, I need your advice to make a difficult career decision about my engineering path. What should I do?"
    base_prompt = "You are responding as Dr. A.P.J. Abdul Kalam."
    
    prompt, triggered, conf, keys = apply_humility_gate(query, sample_schema, base_prompt)
    
    assert triggered is False
    assert conf >= TAU
    assert HUMILITY_PREFACE not in prompt
    assert any("advice_tone" in k or "topic:Career" in k for k in keys)


def test_out_of_domain_cryptocurrency_query(sample_schema):
    """Out-of-domain query (cryptocurrency) should trigger tau=0.70 and inject preface h and phi."""
    query = "What is your opinion on investing all our money into speculative cryptocurrency and algorithmic Bitcoin NFTs?"
    base_prompt = "You are responding as Dr. A.P.J. Abdul Kalam."
    
    prompt, triggered, conf, keys = apply_humility_gate(query, sample_schema, base_prompt)
    
    assert triggered is True
    assert conf < TAU
    assert HUMILITY_PREFACE in prompt
    assert "CONSTRAINT phi" in prompt
