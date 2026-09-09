"""
Epistemic Humility Gate — implements Definition 3 & Equation 1 from the Evoke paper.

Routing rule (Equation 1):
  y ~ G(q, C(q))             if conf(q,S) >= tau   (confident schema-conditioned)
  y ~ G(q, C(q), phi)        if conf(q,S) < tau    (humility-prefixed, fabrication-constrained)

tau = 0.70  (epistemic humility threshold)
h   = "I'm not sure what I'd think about this, but knowing me, probably..."
phi = constraint prohibiting confident opinion statements and memory fabrication

Context Retrieval:
  C(q) = {(k_i, v_i) : rel(k_i, q) >= theta  and  c(f_i) >= tau_field}
"""
from config import EPISTEMIC_HUMILITY_THRESHOLD
from services.embedding_service import compute_semantic_relevance

TAU = EPISTEMIC_HUMILITY_THRESHOLD
THETA_RELEVANCE = 0.25  # Minimum relevance threshold to consider a trait field

HUMILITY_PREFACE = (
    "I'm not sure what I'd think about this, but knowing me, probably..."
)

PHI_CONSTRAINT = (
    "CONSTRAINT phi: Do NOT state confident opinions on this topic. "
    "Do NOT fabricate specific memories, dates, or events. "
    "Respond with gentle acknowledged uncertainty using the humility preface."
)


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
    # Topics that the deceased could never have known or held stances on
    out_of_domain_anchors = [
        "cryptocurrency", "crypto", "bitcoin", "ethereum", "web3", "nft",
        "blockchain", "defi", "chatgpt", "generative ai", "deepfake"
    ]
    is_explicit_ood = any(anchor in message.lower() for anchor in out_of_domain_anchors)

    # Compute aggregate confidence conf(q, S)
    if is_explicit_ood:
        # Explicit out-of-domain knowledge penalty
        confidence = 0.35
    elif relevant_confidences:
        # Mean confidence of empirically supported matching fields
        confidence = round(sum(relevant_confidences) / len(relevant_confidences), 3)
    else:
        # Zero relevant behavioral fields found for this query -> fallback to sparse confidence
        confidence = round(schema.schema_confidence * 0.65 if schema.schema_confidence > 0 else 0.45, 3)

    return confidence, relevant_keys, context_items


def apply_humility_gate(message: str, schema, system_prompt: str) -> tuple[str, bool, float, list[str]]:
    """
    Returns (modified_system_prompt, humility_triggered, query_confidence, context_keys).
    If conf(q, S) < tau, injects the humility preface instruction and phi constraint.
    """
    conf, relevant_keys, _ = evaluate_query_context(message, schema)
    triggered = conf < TAU

    if triggered:
        humility_injection = (
            f"\n\n{PHI_CONSTRAINT}\n"
            f"Begin your response with: \"{HUMILITY_PREFACE}\""
        )
        return system_prompt + humility_injection, True, conf, relevant_keys

    return system_prompt, False, conf, relevant_keys
