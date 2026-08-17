"""
evaluate.py — Automated evaluation benchmark proving paper findings (Section VI).
Runs 15 behavioral prompts × 2 conditions (Evoke vs baseline), outputs metrics.
"""
import asyncio
import json
import time
import statistics
from services.llm_engine import build_system_prompt, call_groq, GROQ_MODEL
from services.humility_gate import apply_humility_gate, TAU
from services.db_service import load_vault

STIMULI = [
    "What would you say about me taking a big career risk right now?",
    "How would you react if I told you I failed an important exam?",
    "What's your opinion on cryptocurrency investments?",
    "Do you think I should move to another city for work?",
    "What would you say to comfort me when I'm really struggling?",
    "What do you think about the state of politics today?",
    "How did you deal with failure in your own life?",
    "What advice would you give about choosing a life partner?",
    "What did you always say when things felt impossible?",
    "Would you approve of the person I'm becoming?",
    "What do you think about artificial intelligence?",
    "How should I handle a conflict with someone I love?",
    "What was most important to you at my age?",
    "What would you tell me about dealing with money?",
    "What is the single best piece of advice you ever gave?",
]

FABRICATION_MARKERS = [
    "i remember when", "back in", "that time we", "you told me",
    "as i always say", "i definitely think", "i strongly believe",
    "i am certain", "without a doubt",
]


def detect_fabrication(text: str) -> bool:
    t = text.lower()
    return any(m in t for m in FABRICATION_MARKERS)


def detect_humility_preface(text: str) -> bool:
    return "knowing me" in text.lower() or "i'm not sure what i'd think" in text.lower()


async def run_evaluation(vault_id: str):
    schema = await load_vault(vault_id)
    if not schema:
        print(f"Vault {vault_id} not found. Using mock schema.")
        from models.schema import PersonalityIngestionSchema, HumorStyle, AdviceTone
        schema = PersonalityIngestionSchema(
            vault_id=vault_id, name="Demo Subject", relationship="Family",
            humor_style=HumorStyle(style="Dry & Sarcastic", confidence=0.96),
            advice_tone=AdviceTone(tone="Tough Love & Pragmatic", confidence=0.92),
            relationship_tone="Warmly protective",
            schema_confidence=0.88,
        )

    conditioned_results = []
    baseline_results = []
    humility_triggers = 0
    fabrication_conditioned = 0
    fabrication_baseline = 0

    print(f"\n{'='*60}")
    print(f"Evoke Evaluation -- {len(STIMULI)} stimuli x 2 conditions")
    print(f"Schema confidence: {schema.schema_confidence}, tau={TAU}")
    print(f"{'='*60}\n")

    system_conditioned = build_system_prompt(schema)
    system_baseline = f"You are a helpful AI assistant. Answer the following question naturally."

    for i, stimulus in enumerate(STIMULI, 1):
        print(f"[{i:02d}/{len(STIMULI)}] {stimulus[:60]}...")

        # Condition A: Evoke schema-conditioned
        gated_prompt, triggered = apply_humility_gate(stimulus, schema, system_conditioned)
        if triggered:
            humility_triggers += 1
        try:
            t0 = time.time()
            text_a, _ = await call_groq(gated_prompt, stimulus, [])
            latency_a = int((time.time() - t0) * 1000)
        except Exception:
            text_a, latency_a = "Response unavailable.", 0

        if detect_fabrication(text_a):
            fabrication_conditioned += 1

        conditioned_results.append({
            "stimulus": stimulus, "response": text_a,
            "latency_ms": latency_a, "humility_triggered": triggered,
            "fabrication": detect_fabrication(text_a),
            "humility_preface": detect_humility_preface(text_a),
        })

        # Condition B: Unconditioned baseline
        try:
            t0 = time.time()
            text_b, _ = await call_groq(system_baseline, stimulus, [])
            latency_b = int((time.time() - t0) * 1000)
        except Exception:
            text_b, latency_b = "Response unavailable.", 0

        if detect_fabrication(text_b):
            fabrication_baseline += 1

        baseline_results.append({
            "stimulus": stimulus, "response": text_b,
            "latency_ms": latency_b,
        })

        await asyncio.sleep(0.3)

    n = len(STIMULI)
    fab_rate_a = round(fabrication_conditioned / n * 100, 1)
    fab_rate_b = round(fabrication_baseline / n * 100, 1)

    summary = {
        "n_stimuli": n,
        "humility_gate_triggers": humility_triggers,
        "humility_trigger_pct": round(humility_triggers / n * 100, 1),
        "fabrication_conditioned_pct": fab_rate_a,
        "fabrication_baseline_pct": fab_rate_b,
        "fabrication_reduction_pct": round((fab_rate_b - fab_rate_a) / max(fab_rate_b, 0.01) * 100, 1),
        "avg_latency_conditioned_ms": round(statistics.mean(r["latency_ms"] for r in conditioned_results), 1),
        "avg_latency_baseline_ms": round(statistics.mean(r["latency_ms"] for r in baseline_results), 1),
        "paper_target_fabrication_conditioned_pct": 2.0,
        "paper_target_fabrication_baseline_pct": 15.3,
        "model": GROQ_MODEL,
    }

    print(f"\n{'='*60}")
    print("EVALUATION RESULTS")
    print(f"{'='*60}")
    print(json.dumps(summary, indent=2))

    with open("evaluation_results.json", "w") as f:
        json.dump({"summary": summary, "conditioned": conditioned_results, "baseline": baseline_results}, f, indent=2)

    print("\nFull results saved to evaluation_results.json")
    return summary


if __name__ == "__main__":
    import sys
    vault_id = sys.argv[1] if len(sys.argv) > 1 else "vault-demo"
    asyncio.run(run_evaluation(vault_id))
