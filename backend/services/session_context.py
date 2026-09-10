"""
Session Context Service — Live conversation state extraction.

Extracts four things from the raw conversation history:
  1. topics_discussed      — what themes have been building up
  2. user_self_disclosures — facts the user has revealed about themselves
  3. used_phrases          — signature phrases already woven in (for deduplication)
  4. emotional_register    — inferred emotional state of the user (recent turns)

Also provides:
  - build_session_block()     → persona-natural text block for the system prompt
  - select_relevant_phrases() → 1-2 semantically relevant, not-yet-used phrases
"""
import re
from dataclasses import dataclass, field


# ─────────────────────────────────────────────────────────────────────────────
# Pattern Banks
# ─────────────────────────────────────────────────────────────────────────────

SELF_DISCLOSURE_PATTERNS = [
    r"\bI(?:'m| am)\s+(a\s+)?([a-zA-Z ]{3,35}(?:student|engineer|doctor|teacher|researcher|developer|designer|artist|writer|founder))",
    r"\bmy\s+(dad|mom|mother|father|brother|sister|wife|husband|son|daughter|grandfather|grandmother|mentor|teacher|friend)\b",
    r"\bI(?:'ve| have)\s+(failed|lost|got|joined|left|started|finished|dropped out of|been struggling with)\s+([a-zA-Z ]{2,35})",
    r"\bI(?:'m| am)\s+studying\s+([a-zA-Z ]{3,40})",
    r"\bI(?:'m| am)\s+working\s+(?:at|on|for)\s+([a-zA-Z ]{3,40})",
    r"\bI\s+feel\s+(very\s+)?([a-zA-Z ]{3,30})",
    r"\bI(?:'m| am)\s+(very\s+)?(scared|worried|anxious|confused|lost|stuck|frustrated|hopeful|motivated|excited|devastated)",
]

EMOTIONAL_KEYWORDS: dict[str, list[str]] = {
    "anxious": ["anxious", "worried", "scared", "afraid", "nervous", "stressed", "overwhelmed", "panic"],
    "grieving": ["lost", "passed away", "died", "miss", "grief", "mourning", "death", "gone"],
    "seeking_guidance": ["should i", "what do i do", "help me", "guide me", "advice", "confused", "uncertain", "don't know what"],
    "motivated": ["excited", "motivated", "inspired", "ready", "determined", "hopeful", "passionate"],
    "frustrated": ["frustrated", "stuck", "can't", "impossible", "hopeless", "pointless", "nothing works", "failing"],
    "reflective": ["thinking about", "wondering", "reflecting", "looking back", "reminds me", "makes me think"],
}

TOPIC_KEYWORDS: dict[str, list[str]] = {
    "Failure & Resilience":     ["fail", "failure", "mistake", "lost", "setback", "wrong", "crash", "collapse", "messed up"],
    "Career & Purpose":         ["career", "job", "work", "profession", "goal", "ambition", "mission", "purpose", "path", "internship"],
    "Family & Relationships":   ["family", "friend", "love", "relationship", "marriage", "conflict", "trust", "support", "father", "mother"],
    "Learning & Growth":        ["learn", "study", "knowledge", "university", "education", "skill", "improve", "grow", "college", "degree"],
    "Leadership":               ["team", "leader", "manage", "lead", "responsibility", "decision", "command", "manager"],
    "Values & Ethics":          ["integrity", "right", "wrong", "moral", "ethical", "honest", "principle", "fair", "justice"],
    "Life Philosophy":          ["life", "meaning", "purpose", "happiness", "peace", "wisdom", "truth", "why", "point of"],
    "Science & Technology":     ["science", "technology", "research", "engineer", "innovation", "discovery", "invention"],
    "Money & Security":         ["money", "financial", "salary", "loan", "debt", "investment", "savings", "afford"],
    "Mental Health & Stress":   ["mental health", "depression", "burnout", "anxiety", "therapy", "counseling", "breakdown"],
}


# ─────────────────────────────────────────────────────────────────────────────
# Data Class
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class SessionState:
    topics_discussed: list[str] = field(default_factory=list)
    user_self_disclosures: list[str] = field(default_factory=list)
    used_phrases: set[str] = field(default_factory=set)
    open_threads: list[str] = field(default_factory=list)
    emotional_register: str = "neutral"
    turn_count: int = 0
    first_user_message: str = ""


# ─────────────────────────────────────────────────────────────────────────────
# Core Extraction
# ─────────────────────────────────────────────────────────────────────────────

def extract_session_state(history: list[dict], schema=None) -> SessionState:
    """
    Analyzes the full conversation history to extract live session context.

    Args:
        history: list of {"role": "user"|"assistant", "content": str} dicts
        schema:  PersonalityIngestionSchema (used for phrase deduplication)
    Returns:
        SessionState dataclass
    """
    state = SessionState()

    user_messages    = [h for h in history if h.get("role") == "user"]
    assistant_messages = [h for h in history if h.get("role") == "assistant"]
    state.turn_count = len(user_messages)

    if not history:
        return state

    if user_messages:
        state.first_user_message = user_messages[0].get("content", "")

    # ── 1. Topics covered (across all messages) ──────────────────────────────
    all_text = " ".join(h.get("content", "") for h in history).lower()
    for topic_label, keywords in TOPIC_KEYWORDS.items():
        if any(kw in all_text for kw in keywords):
            if topic_label not in state.topics_discussed:
                state.topics_discussed.append(topic_label)

    # ── 2. User self-disclosures (user messages only) ────────────────────────
    user_text = " ".join(m.get("content", "") for m in user_messages)
    for pattern in SELF_DISCLOSURE_PATTERNS:
        matches = re.findall(pattern, user_text, re.IGNORECASE)
        for match in matches:
            disclosure = " ".join(match).strip().lower() if isinstance(match, tuple) else match.strip().lower()
            # Clean up stopwords and filler
            disclosure = re.sub(r'^(a|an|the|very|so|really|just|i am|i\'m)\s+', '', disclosure).strip()
            if disclosure and len(disclosure) > 2 and disclosure not in state.user_self_disclosures:
                state.user_self_disclosures.append(disclosure)

    # ── 3. Emotional register (recent 3 user messages) ───────────────────────
    recent_user_text = " ".join(m.get("content", "") for m in user_messages[-3:]).lower()
    best_emotion, best_score = "neutral", 0
    for emotion, keywords in EMOTIONAL_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in recent_user_text)
        if score > best_score:
            best_score, best_emotion = score, emotion
    state.emotional_register = best_emotion

    # ── 4. Phrase deduplication (assistant messages) ─────────────────────────
    if schema:
        assistant_text = " ".join(m.get("content", "") for m in assistant_messages).lower()
        for phrase_obj in getattr(schema, "signature_phrases", []):
            # Match on first 35 characters (robust to minor paraphrasing)
            phrase_start = phrase_obj.phrase[:35].lower()
            if phrase_start in assistant_text:
                state.used_phrases.add(phrase_obj.phrase)

    # ── 5. Open threads (last user message is a question we may not have addressed) ─
    if len(user_messages) >= 2:
        second_last = user_messages[-2].get("content", "")
        if "?" in second_last:
            state.open_threads.append(second_last[:90].strip())

    return state


# ─────────────────────────────────────────────────────────────────────────────
# Session Block Builder
# ─────────────────────────────────────────────────────────────────────────────

def build_session_block(state: SessionState, schema=None) -> str:
    """
    Constructs a persona-natural session context block to inject into the system prompt.
    Returns empty string for brand-new conversations (turn_count <= 1).
    """
    if state.turn_count <= 1:
        return ""

    parts = []

    # Conversational arc — how far in we are
    if state.turn_count >= 8:
        parts.append(
            "We have been talking for a while now. I can be more candid and personal with you."
        )
    elif state.turn_count >= 4:
        parts.append(
            "We have been in conversation for several exchanges. I have a clearer sense of what you are working through."
        )
    else:
        parts.append(
            "We are still early in this conversation, so I am paying careful attention to what you are actually asking."
        )

    # Topics covered
    if state.topics_discussed:
        topic_str = ", ".join(state.topics_discussed[:4])
        parts.append(f"So far our conversation has touched on: {topic_str}.")

    # User self-disclosures — the most powerful authenticity signal
    if state.user_self_disclosures:
        disclosures = state.user_self_disclosures[:3]
        disclosure_str = "; ".join(disclosures)
        parts.append(
            f"From what you have shared, I understand that you are {disclosure_str}. "
            f"I am holding that in mind as I respond to you."
        )

    # Emotional register annotation
    emotional_notes = {
        "anxious":         "You are carrying real worry right now, and I want to speak to that directly rather than around it.",
        "grieving":        "I can sense there is real tenderness in what you are carrying. I will speak gently.",
        "seeking_guidance":"You are looking for something concrete, not empty words. I will try to give you that.",
        "motivated":       "I can feel your drive and energy. Let me help you focus it well.",
        "frustrated":      "I can tell you are stuck and it is wearing on you. Let me be genuinely useful rather than general.",
        "reflective":      "You are in a reflective state — which is exactly where real decisions get made.",
    }
    note = emotional_notes.get(state.emotional_register, "")
    if note:
        parts.append(note)

    return "\n".join(parts)


# ─────────────────────────────────────────────────────────────────────────────
# Phrase Selector
# ─────────────────────────────────────────────────────────────────────────────

def select_relevant_phrases(
    query: str,
    schema,
    used_phrases: set[str],
    max_count: int = 2,
) -> list[str]:
    """
    Selects 1-2 signature phrases most semantically relevant to the current query,
    explicitly excluding phrases already woven in earlier in this session.

    Returns a list of phrase strings (not phrase objects).
    """
    try:
        from services.embedding_service import compute_semantic_relevance
    except ImportError:
        return []

    candidates = []
    for phrase_obj in getattr(schema, "signature_phrases", []):
        if phrase_obj.phrase in used_phrases:
            continue  # Already used this session — skip
        score = compute_semantic_relevance(query, phrase_obj.phrase)
        candidates.append((score, phrase_obj.phrase))

    # Sort by relevance descending; return top max_count only
    candidates.sort(key=lambda x: x[0], reverse=True)

    # Only return phrases that have at least minimal relevance (avoid totally random phrases)
    threshold = 0.05
    return [phrase for score, phrase in candidates[:max_count] if score >= threshold]
