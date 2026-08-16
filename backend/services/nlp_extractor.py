"""
NLP Extractor — simulates Amazon Transcribe + Comprehend pipeline.
In production: replace with real boto3 calls to Transcribe and Comprehend.
"""
import re
from models.schema import (
    PersonalityIngestionSchema, HumorStyle, AdviceTone,
    SignaturePhrase, TopicOpinion
)


HUMOR_KEYWORDS = {
    "dry": ["dry", "sarcastic", "deadpan", "irony", "ironic"],
    "warm": ["laugh", "warm", "gentle", "giggle", "chuckle"],
    "witty": ["witty", "clever", "quick", "sharp"],
    "self-deprecating": ["self", "deprecat", "humble", "myself"],
}

ADVICE_KEYWORDS = {
    "Tough Love & Pragmatic": ["practical", "tough", "pragmatic", "discipline", "standard"],
    "Nurturing & Patient": ["patient", "nurturing", "gentle", "care", "comfort"],
    "Socratic & Questioning": ["question", "think", "why", "figure", "understand"],
    "Direct & Decisive": ["direct", "decide", "action", "do it", "clear"],
}


def _extract_sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r'[.!?]', text) if len(s.strip()) > 15]


def _detect_humor(responses: dict[str, str]) -> HumorStyle:
    combined = " ".join(responses.values()).lower()
    for style, keywords in HUMOR_KEYWORDS.items():
        if any(k in combined for k in keywords):
            return HumorStyle(style=style.title(), confidence=0.82)
    return HumorStyle(style="Thoughtful & Warm", confidence=0.70)


def _detect_advice_tone(responses: dict[str, str]) -> AdviceTone:
    combined = " ".join(responses.values()).lower()
    for tone, keywords in ADVICE_KEYWORDS.items():
        if any(k in combined for k in keywords):
            return AdviceTone(tone=tone, confidence=0.80)
    return AdviceTone(tone="Thoughtful & Caring", confidence=0.72)


def _extract_phrases(responses: dict[str, str]) -> list[SignaturePhrase]:
    phrases = []
    for prompt_id, text in responses.items():
        sentences = _extract_sentences(text)
        for s in sentences[:2]:
            if len(s) > 20:
                phrases.append(SignaturePhrase(
                    phrase=s[:80],
                    context=f"Extracted from prompt response #{prompt_id}",
                    confidence=round(0.75 + (len(s) % 20) * 0.01, 2),
                ))
    return phrases[:6]


def _extract_topics(responses: dict[str, str]) -> list[TopicOpinion]:
    topic_map = {
        "family": ("Family & Relationships", "Family comes first, always."),
        "work": ("Career & Ambition", "Work with integrity and quiet mastery."),
        "failure": ("Handling Failure", "Failure is expensive tuition. Learn fast."),
        "money": ("Money & Security", "Live below your means; invest in knowledge."),
        "love": ("Love & Connection", "Show up when it matters most."),
    }
    combined = " ".join(responses.values()).lower()
    opinions = []
    for keyword, (topic, stance) in topic_map.items():
        if keyword in combined:
            opinions.append(TopicOpinion(
                topic=topic, stance=stance,
                intensity=round(70 + (len(keyword) * 3) % 25, 1),
                detail="Extracted from onboarding prompt responses.",
                confidence=0.78,
            ))
    return opinions[:4]


def compute_completeness(schema: PersonalityIngestionSchema) -> float:
    """
    score(S) = coverage(K) * c̄(F)
    K = {humor_style, advice_tone, signature_phrases, relationship_tone,
         topic_stances, conflict_behaviour, narrative_patterns}
    """
    k_total = 7
    k_covered = sum([
        1 if schema.humor_style.style else 0,
        1 if schema.advice_tone.tone else 0,
        1 if schema.signature_phrases else 0,
        1 if schema.relationship_tone else 0,
        1 if schema.topic_opinions else 0,
        1 if schema.active_topics else 0,
        1 if schema.description else 0,
    ])
    coverage = k_covered / k_total
    all_confidences = (
        [schema.humor_style.confidence, schema.advice_tone.confidence]
        + [p.confidence for p in schema.signature_phrases]
        + [o.confidence for o in schema.topic_opinions]
    )
    c_bar = sum(all_confidences) / len(all_confidences) if all_confidences else 0.5
    return round(coverage * c_bar * 100, 1)


def extract_schema_from_onboard(
    name: str,
    relationship: str,
    description: str,
    prompt_responses: dict[str, str],
) -> PersonalityIngestionSchema:
    humor = _detect_humor(prompt_responses)
    advice = _detect_advice_tone(prompt_responses)
    phrases = _extract_phrases(prompt_responses)
    opinions = _extract_topics(prompt_responses)

    combined = " ".join(prompt_responses.values()).lower()
    rel_tone = "Warm and deeply caring"
    if "strict" in combined or "discipline" in combined:
        rel_tone = "Warmly protective with high standards"
    elif "funny" in combined or "laugh" in combined:
        rel_tone = "Playful, light-hearted, deeply loving"

    schema = PersonalityIngestionSchema(
        name=name,
        relationship=relationship,
        description=description,
        humor_style=humor,
        advice_tone=advice,
        relationship_tone=rel_tone,
        active_topics=[o.topic for o in opinions],
        signature_phrases=phrases,
        topic_opinions=opinions,
        schema_confidence=round(
            (humor.confidence + advice.confidence) / 2, 2
        ),
    )
    schema.completeness_score = compute_completeness(schema)
    return schema
