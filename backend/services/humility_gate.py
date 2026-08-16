"""
Epistemic Humility Gate — implements Definition 3 from the Evoke paper.

Routing rule (Equation 1):
  y ~ G(q, C(q))             if conf(q,S) >= tau   (confident schema-conditioned)
  y ~ G(q, C(q), phi)        if conf(q,S) < tau    (humility-prefixed, fabrication-constrained)

tau = 0.70  (epistemic humility threshold)
h   = "I'm not sure what I'd think about this, but knowing me, probably..."
phi = constraint prohibiting confident opinion statements and memory fabrication
"""
from config import EPISTEMIC_HUMILITY_THRESHOLD

TAU = EPISTEMIC_HUMILITY_THRESHOLD

HUMILITY_PREFACE = (
    "I'm not sure what I'd think about this, but knowing me, probably..."
)

PHI_CONSTRAINT = (
    "CONSTRAINT phi: Do NOT state confident opinions on this topic. "
    "Do NOT fabricate specific memories, dates, or events. "
    "Respond with gentle acknowledged uncertainty using the humility preface."
)


def compute_query_confidence(message: str, schema) -> float:
    """
    Aggregate confidence over fields relevant to query q.
    conf(q, S) = mean confidence of fields whose key is semantically
    relevant to the query.  Without an embedding model, we use keyword
    overlap as a proxy — sufficient for the demo evaluation pipeline.
    """
    from models.schema import PersonalityIngestionSchema

    msg_lower = message.lower()
    relevant_confidences: list[float] = []

    # Humor field relevance
    humor_triggers = {"laugh", "funny", "joke", "humor", "humour", "sarcasm", "wit"}
    if any(w in msg_lower for w in humor_triggers):
        relevant_confidences.append(schema.humor_style.confidence)

    # Advice field relevance
    advice_triggers = {"advice", "should", "decision", "hard", "problem", "help", "what do"}
    if any(w in msg_lower for w in advice_triggers):
        relevant_confidences.append(schema.advice_tone.confidence)

    # Signature phrases
    for phrase in schema.signature_phrases:
        for word in phrase.phrase.lower().split():
            if len(word) > 4 and word in msg_lower:
                relevant_confidences.append(phrase.confidence)
                break

    # Topic opinions
    for opinion in schema.topic_opinions:
        topic_words = opinion.topic.lower().split()
        if any(w in msg_lower for w in topic_words):
            relevant_confidences.append(opinion.confidence)

    # General schema confidence as floor
    relevant_confidences.append(schema.schema_confidence if schema.schema_confidence > 0 else 0.75)

    return sum(relevant_confidences) / len(relevant_confidences)


def apply_humility_gate(message: str, schema, system_prompt: str) -> tuple[str, bool]:
    """
    Returns (modified_system_prompt, humility_triggered).
    If conf < tau, injects the humility preface instruction and phi constraint.
    """
    conf = compute_query_confidence(message, schema)
    triggered = conf < TAU

    if triggered:
        humility_injection = (
            f"\n\n{PHI_CONSTRAINT}\n"
            f"Begin your response with: \"{HUMILITY_PREFACE}\""
        )
        return system_prompt + humility_injection, True

    return system_prompt, False
