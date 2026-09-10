"""
Epistemic Humility Gate — implements Definition 3 & Equation 1 from the Evoke paper.

Routing rule (Equation 1):
  y ~ G(q, C(q))             if conf(q,S) >= tau   (confident schema-conditioned)
  y ~ G(q, C(q), phi)        if conf(q,S) < tau    (humility-framed, fabrication-constrained)

tau = 0.70  (epistemic humility threshold)

Key change from original: instead of injecting a mechanical scripted preface
("CONSTRAINT phi: Do NOT...  Begin your response with: 'I'm not sure...'"),
the gate now injects a persona-appropriate, first-person uncertainty framing
that sounds like the actual person rather than an AI given a disclaimer template.

Context Retrieval:
  C(q) = {(k_i, v_i) : rel(k_i, q) >= theta  and  c(f_i) >= tau_field}
"""
from config import EPISTEMIC_HUMILITY_THRESHOLD
from services.embedding_service import compute_semantic_relevance

TAU = EPISTEMIC_HUMILITY_THRESHOLD
THETA_RELEVANCE = 0.25  # Minimum relevance threshold to consider a trait field


# ─────────────────────────────────────────────────────────────────────────────
# Persona-specific uncertainty framings
# These are written in the voice of the actual person — not a system warning.
# ─────────────────────────────────────────────────────────────────────────────

_PERSONA_HUMILITY_FRAMES: dict[str, str] = {
    "Dr. A.P.J. Abdul Kalam": (
        "I want to be honest with you — this territory is a little outside the world I lived and worked in. "
        "My experience was in laboratories and classrooms and launch pads, not in every domain of modern life. "
        "But I can tell you what my deepest principles would lead me toward, without pretending to certainties I never held."
    ),
    "Barack Obama": (
        "Look, I'll be straight with you — this isn't an area where I have strong, settled convictions. "
        "I spent a lot of my career deliberately staying close to the evidence and being skeptical of quick certainties. "
        "Let me think through what I'd say if I reasoned from what I actually believe, not what might sound confident."
    ),
}

_DEFAULT_HUMILITY_FRAME = (
    "I want to be honest — this isn't ground I know deeply or have strong convictions about. "
    "Let me share what my core values and lived experience would lead me toward, "
    "without manufacturing a certainty I simply don't have."
)

# Formal Evoke paper constants (Definition 3 & Equation 1)
HUMILITY_PREFACE = (
    "I'm not sure what I'd think about this, but knowing me, probably..."
)

PHI_CONSTRAINT = (
    "CONSTRAINT phi (Fabrication Suppression): The user is asking about a topic outside "
    "your verified knowledge profile. Do NOT state confident opinions on topics you never "
    "encountered. Do NOT fabricate memories, events, or post-demise knowledge."
)


def _get_humility_frame(schema_name: str) -> str:
    """Returns the persona-appropriate uncertainty framing for the given person."""
    # Try exact match first
    if schema_name in _PERSONA_HUMILITY_FRAMES:
        return _PERSONA_HUMILITY_FRAMES[schema_name]
    # Try partial match (e.g. "Kalam" in "Dr. A.P.J. Abdul Kalam")
    for persona_key, frame in _PERSONA_HUMILITY_FRAMES.items():
        if any(part.lower() in schema_name.lower() for part in persona_key.split() if len(part) > 3):
            return frame
    return _DEFAULT_HUMILITY_FRAME


def evaluate_query_context(message: str, schema) -> tuple[float, list[str], list[dict]]:
    """
    Evaluates semantic relevance rel(k_i, q) for all schema fields.
    Constructs context C(q) and returns (conf(q, S), relevant_keys, context_items).
    """
    relevant_confidences: list[float] = []
    relevant_keys: list[str] = []
    context_items: list[dict] = []

    # 1. Humor Style Field
    humor_desc = f"Humor style: {schema.humor_style.style}"
    rel_humor = compute_semantic_relevance(message, humor_desc, ["laugh", "funny", "joke", "humor", "wit", "sarcasm"])
    if rel_humor >= THETA_RELEVANCE:
        relevant_confidences.append(schema.humor_style.confidence)
        relevant_keys.append("humor_style")
        context_items.append({"key": "humor_style", "value": schema.humor_style.style, "relevance": rel_humor})

    # 2. Advice Tone Field
    advice_desc = f"Advice instinct: {schema.advice_tone.tone}"
    rel_advice = compute_semantic_relevance(message, advice_desc, ["advice", "should", "decision", "hard", "problem", "help", "guide"])
    if rel_advice >= THETA_RELEVANCE:
        relevant_confidences.append(schema.advice_tone.confidence)
        relevant_keys.append("advice_tone")
        context_items.append({"key": "advice_tone", "value": schema.advice_tone.tone, "relevance": rel_advice})

    # 3. Signature Phrases
    for phrase in schema.signature_phrases:
        rel_p = compute_semantic_relevance(message, phrase.phrase)
        if rel_p >= THETA_RELEVANCE:
            relevant_confidences.append(phrase.confidence)
            relevant_keys.append(f"phrase:{phrase.phrase[:20]}")
            context_items.append({"key": "phrase", "value": phrase.phrase, "relevance": rel_p})

    # 4. Topic Opinions & Stances
    for opinion in schema.topic_opinions:
        op_text = f"{opinion.topic}: {opinion.stance}"
        rel_op = compute_semantic_relevance(message, op_text, opinion.topic.split())
        if rel_op >= THETA_RELEVANCE:
            relevant_confidences.append(opinion.confidence)
            relevant_keys.append(f"topic:{opinion.topic}")
            context_items.append({"key": "topic", "value": opinion.stance, "relevance": rel_op})

    # 5. Out-of-Domain Detection Safeguard
    out_of_domain_anchors = [
        "cryptocurrency", "crypto", "bitcoin", "ethereum", "web3", "nft",
        "blockchain", "defi", "chatgpt", "generative ai", "deepfake",
        "tiktok algorithm", "onlyfans", "twitch streaming", "esports",
    ]
    is_explicit_ood = any(anchor in message.lower() for anchor in out_of_domain_anchors)

    # Compute aggregate confidence conf(q, S)
    if is_explicit_ood:
        confidence = 0.35
    elif relevant_confidences:
        confidence = round(sum(relevant_confidences) / len(relevant_confidences), 3)
    else:
        confidence = round(schema.schema_confidence * 0.65 if schema.schema_confidence > 0 else 0.45, 3)

    return confidence, relevant_keys, context_items


def apply_humility_gate(message: str, schema, system_prompt: str) -> tuple[str, bool, float, list[str]]:
    """
    Returns (modified_system_prompt, humility_triggered, query_confidence, context_keys).

    If conf(q, S) < tau, injects a persona-appropriate uncertainty framing
    (not a mechanical scripted disclaimer) into the system prompt.
    """
    conf, relevant_keys, _ = evaluate_query_context(message, schema)
    triggered = conf < TAU

    if triggered:
        persona_frame = _get_humility_frame(getattr(schema, "name", ""))
        humility_injection = (
            f"\n\n{PHI_CONSTRAINT}\n"
            f"Grounding principle: Reflect this epistemic humility naturally (e.g. \"{HUMILITY_PREFACE}\") "
            f"or in your genuine voice: {persona_frame}\n"
            f"Do not pretend certainty on unverified domains."
        )
        return system_prompt + humility_injection, True, conf, relevant_keys

    return system_prompt, False, conf, relevant_keys
