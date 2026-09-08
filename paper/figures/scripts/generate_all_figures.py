"""
generate_all_figures.py — Master IEEE publication figure generator for Evoke research paper.
Renders all 6 figures in both high-res (300 DPI) PNG and vector PDF formats into paper/figures/.
Configured with IEEE standard typography, dimensions, and styling.
"""
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from pathlib import Path

# Configure Matplotlib for IEEE publication quality
plt.rcParams.update({
    "font.family": "serif",
    "font.size": 9,
    "axes.labelsize": 10,
    "axes.titlesize": 10,
    "xtick.labelsize": 8.5,
    "ytick.labelsize": 8.5,
    "legend.fontsize": 8.5,
    "figure.titlesize": 11,
    "figure.dpi": 300,
    "savefig.dpi": 300,
    "savefig.bbox": "tight",
    "axes.linewidth": 0.8,
    "grid.linewidth": 0.5,
    "grid.alpha": 0.4,
})

out_dir = Path(__file__).resolve().parent.parent
out_dir.mkdir(parents=True, exist_ok=True)


# ==============================================================================
# FIGURE 1: CONCEPTUAL CONTRAST
# ==============================================================================
def generate_fig1():
    fig, ax = plt.subplots(figsize=(7.0, 3.2))
    ax.axis("off")
    
    # Title / Header
    ax.text(0.5, 0.96, "Fig. 1. Conceptual contrast: Prior Unstructured Approaches vs. Evoke Structured PIS",
            ha="center", va="top", fontsize=10, fontweight="bold")

    # --- TOP ROW: PRIOR WORK ---
    ax.text(0.02, 0.72, "(A) Prior Work:\nUnstructured\nPersonalization", fontsize=8.5, fontweight="bold", va="center")
    
    # Box 1: Raw Artifacts
    rect1 = patches.FancyBboxPatch((0.18, 0.58), 0.22, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#f5f5f5", edgecolor="#666666", linewidth=1.0)
    ax.add_patch(rect1)
    ax.text(0.29, 0.71, "Raw Experience Data\n(Voice notes, chats,\nfree-text profiles)", ha="center", va="center", fontsize=7.5)
    
    # Arrow
    ax.annotate("", xy=(0.48, 0.71), xytext=(0.41, 0.71),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#333333"))
    
    # Box 2: Language Model
    rect2 = patches.FancyBboxPatch((0.49, 0.58), 0.20, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#e8eaf6", edgecolor="#3f51b5", linewidth=1.0)
    ax.add_patch(rect2)
    ax.text(0.59, 0.71, "Language Model\n(Direct Prompting /\nFull Fine-Tuning)", ha="center", va="center", fontsize=7.5)
    
    # Arrow
    ax.annotate("", xy=(0.77, 0.71), xytext=(0.70, 0.71),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#333333"))
    
    # Box 3: Output Failure Mode
    rect3 = patches.FancyBboxPatch((0.78, 0.58), 0.20, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#ffebee", edgecolor="#c62828", linewidth=1.2)
    ax.add_patch(rect3)
    ax.text(0.88, 0.71, "Fragmented Caricature\n& Value Drift\n(15.3% Fabrications)", ha="center", va="center", fontsize=7.5, color="#b71c1c", fontweight="bold")

    # --- BOTTOM ROW: EVOKE (THIS WORK) ---
    ax.text(0.02, 0.25, "(B) Evoke:\nStructured\nPIS Pipeline", fontsize=8.5, fontweight="bold", va="center")
    
    # Box 1: Raw Data
    rect4 = patches.FancyBboxPatch((0.18, 0.12), 0.16, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#f5f5f5", edgecolor="#666666", linewidth=1.0)
    ax.add_patch(rect4)
    ax.text(0.26, 0.25, "Raw Multi-Modal\nCorpus D\n(Encrypted S3)", ha="center", va="center", fontsize=7.5)
    
    # Arrow
    ax.annotate("", xy=(0.39, 0.25), xytext=(0.35, 0.25),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#2e7d32"))
    
    # Box 2: Structured PIS Schema
    rect5 = patches.FancyBboxPatch((0.40, 0.08), 0.22, 0.34, boxstyle="round,pad=0.02",
                                   facecolor="#e8f5e9", edgecolor="#2e7d32", linewidth=1.4)
    ax.add_patch(rect5)
    ax.text(0.51, 0.32, "Personality Ingestion Schema\nS(p) = (F, c, τ, λ)", ha="center", va="center", fontsize=7.8, fontweight="bold", color="#1b5e20")
    ax.text(0.51, 0.18, "• Typed Behavioral Keys K\n• Confidence Function c(F)\n• Humility Gate (τ = 0.70)", ha="center", va="center", fontsize=7.0, color="#2e7d32")

    # Arrow
    ax.annotate("", xy=(0.67, 0.25), xytext=(0.63, 0.25),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#2e7d32"))

    # Box 3: Conditioning LLM
    rect6 = patches.FancyBboxPatch((0.68, 0.12), 0.14, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#e8eaf6", edgecolor="#3f51b5", linewidth=1.0)
    ax.add_patch(rect6)
    ax.text(0.75, 0.25, "Conditioned\nLlama-3-70B\n(Groq)", ha="center", va="center", fontsize=7.5)

    # Arrow
    ax.annotate("", xy=(0.86, 0.25), xytext=(0.83, 0.25),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#2e7d32"))

    # Box 4: Authentic Output
    rect7 = patches.FancyBboxPatch((0.87, 0.12), 0.12, 0.26, boxstyle="round,pad=0.02",
                                   facecolor="#e0f2f1", edgecolor="#00695c", linewidth=1.2)
    ax.add_patch(rect7)
    ax.text(0.93, 0.25, "Authentic Echo\n(2.0% Fab,\nAuth: 4.21)", ha="center", va="center", fontsize=7.5, color="#004d40", fontweight="bold")

    plt.tight_layout()
    fig.savefig(out_dir / "fig1_conceptual_contrast.pdf")
    fig.savefig(out_dir / "fig1_conceptual_contrast.png")
    plt.close()
    print("Generated Fig 1 (Conceptual Contrast)")


# ==============================================================================
# FIGURE 2: INSTANTIATED SCHEMA CARD
# ==============================================================================
def generate_fig2():
    fig, ax = plt.subplots(figsize=(6.5, 4.0))
    ax.axis("off")
    
    # Outer Card
    outer = patches.FancyBboxPatch((0.05, 0.05), 0.90, 0.88, boxstyle="round,pad=0.02",
                                  facecolor="#fafafa", edgecolor="#424242", linewidth=1.2)
    ax.add_patch(outer)
    
    # Header Banner
    header = patches.Rectangle((0.05, 0.80), 0.90, 0.13, facecolor="#263238", edgecolor="none")
    ax.add_patch(header)
    ax.text(0.08, 0.88, "SUBJECT A — PERSONALITY INGESTION SCHEMA CARD S(p)", color="white", fontsize=9.5, fontweight="bold", va="center")
    ax.text(0.08, 0.83, "Completeness score(S) = 0.81 | Lifetime λ = 365d [DynamoDB TTL Active]", color="#b0bec5", fontsize=7.5, va="center")
    
    # Box 1: In-Domain High Confidence Traits (c >= 0.70)
    box1 = patches.FancyBboxPatch((0.08, 0.44), 0.84, 0.33, boxstyle="round,pad=0.01",
                                  facecolor="#e8f5e9", edgecolor="#4caf50", linewidth=1.0)
    ax.add_patch(box1)
    ax.text(0.10, 0.73, "HIGH-CONFIDENCE BEHAVIORAL TRAITS (c(f) >= tau = 0.70) -> Confident Routing G(q, C(q))",
            color="#1b5e20", fontsize=7.8, fontweight="bold")
    ax.text(0.10, 0.66, "• Humor Style: Dry, Deadpan & Sarcastic with Warm Undertones [c = 0.94 | Audio Interview]", fontsize=7.5)
    ax.text(0.10, 0.59, "• Advice Tone: Tough Love & Pragmatic Engineering Logic [c = 0.92 | Prompt #2]", fontsize=7.5)
    ax.text(0.10, 0.52, "• Phrases: 'Did you measure twice before you cut once?' [c = 0.98 | Voice Note]", fontsize=7.5)
    ax.text(0.10, 0.46, "• Relational Tone: Warmly protective, demanding excellence [c = 0.88 | Family Letters]", fontsize=7.5)

    # Box 2: Shaded Low Confidence / Out-of-Domain Traits (c < 0.70)
    box2 = patches.FancyBboxPatch((0.08, 0.10), 0.84, 0.31, boxstyle="round,pad=0.01",
                                  facecolor="#fff3e0", edgecolor="#ff9800", linewidth=1.0)
    ax.add_patch(box2)
    ax.text(0.10, 0.37, "SHADED MARGINAL / ABSENT FIELDS (c(f) < tau = 0.70) -> Humility Routing h + G(q, C(q), phi)",
            color="#e65100", fontsize=7.8, fontweight="bold")
    ax.text(0.10, 0.30, "• Topic Stance (Crypto/Web3): No documented historical evidence [c = 0.15 < 0.70]", fontsize=7.5, color="#bf360c")
    ax.text(0.10, 0.23, "• Global Politics: Weak agreement across informal messages [c = 0.52 < 0.70]", fontsize=7.5, color="#bf360c")
    ax.text(0.10, 0.15, "• Enforced Output Preface: \"I am not sure what I would think about this, but knowing me, probably...\"",
            fontsize=7.5, fontweight="bold", color="#d84315")

    plt.tight_layout()
    fig.savefig(out_dir / "fig2_schema_card.pdf")
    fig.savefig(out_dir / "fig2_schema_card.png")
    plt.close()
    print("Generated Fig 2 (Schema Card)")


# ==============================================================================
# FIGURE 3: SYSTEM ARCHITECTURE
# ==============================================================================
def generate_fig3():
    fig, ax = plt.subplots(figsize=(7.0, 4.5))
    ax.axis("off")
    
    ax.text(0.5, 0.97, "Fig. 3. Evoke System Architecture (10 AWS Services & 3 External APIs)",
            ha="center", va="top", fontsize=10, fontweight="bold")
    
    # Boundary box for Identity & Role Separation (I1)
    boundary = patches.FancyBboxPatch((0.03, 0.04), 0.94, 0.88, boxstyle="round,pad=0.02",
                                      facecolor="#fafafa", edgecolor="#78909c", linewidth=1.0, linestyle="--")
    ax.add_patch(boundary)
    ax.text(0.06, 0.90, "Identity & Access Control Boundary — Amazon Cognito + API Gateway (Enforces Invariant I1)",
            fontsize=8, fontweight="bold", color="#37474f")

    # Column 1: Ingestion & Extraction
    col1 = patches.FancyBboxPatch((0.06, 0.08), 0.27, 0.78, boxstyle="round,pad=0.01",
                                  facecolor="#e8f5e9", edgecolor="#81c784", linewidth=1.0)
    ax.add_patch(col1)
    ax.text(0.195, 0.82, "INGESTION & EXTRACTION", ha="center", fontsize=8.5, fontweight="bold", color="#2e7d32")
    
    services_c1 = [
        ("Amazon S3", "Encrypted Vault (AES-256)"),
        ("Amazon Transcribe", "Speaker Diarization ASR"),
        ("Amazon Comprehend", "Multi-dim NLP (Keys K)"),
        ("Schema-Builder Lambda", "PIS Population & Versioning"),
        ("Amazon DynamoDB", "Schema Store (TTL I2)")
    ]
    y_pos = 0.72
    for s_name, s_desc in services_c1:
        s_box = patches.FancyBboxPatch((0.08, y_pos - 0.08), 0.23, 0.09, boxstyle="round,pad=0.01",
                                       facecolor="white", edgecolor="#a5d6a7", linewidth=0.8)
        ax.add_patch(s_box)
        ax.text(0.195, y_pos - 0.02, s_name, ha="center", fontsize=7.5, fontweight="bold")
        ax.text(0.195, y_pos - 0.06, s_desc, ha="center", fontsize=6.5, color="#555555")
        y_pos -= 0.13

    # Column 2: Conversation & Inference
    col2 = patches.FancyBboxPatch((0.365, 0.08), 0.27, 0.78, boxstyle="round,pad=0.01",
                                  facecolor="#e3f2fd", edgecolor="#64b5f6", linewidth=1.0)
    ax.add_patch(col2)
    ax.text(0.50, 0.82, "CONVERSATION LAYER", ha="center", fontsize=8.5, fontweight="bold", color="#1565c0")

    services_c2 = [
        ("Amazon API Gateway", "Authenticated REST Endpoint"),
        ("Orchestration Lambda", "Humility Routing Gate (τ)"),
        ("Groq API (Llama-3-70B)", "Primary Inference (<800ms)"),
        ("Gemini 1.5 Flash", "Automatic Model Failover"),
        ("ElevenLabs API", "Neural Voice Synthesis")
    ]
    y_pos = 0.72
    for s_name, s_desc in services_c2:
        s_box = patches.FancyBboxPatch((0.385, y_pos - 0.08), 0.23, 0.09, boxstyle="round,pad=0.01",
                                       facecolor="white", edgecolor="#90caf9", linewidth=0.8)
        ax.add_patch(s_box)
        ax.text(0.50, y_pos - 0.02, s_name, ha="center", fontsize=7.5, fontweight="bold")
        ax.text(0.50, y_pos - 0.06, s_desc, ha="center", fontsize=6.5, color="#555555")
        y_pos -= 0.13

    # Column 3: Frontend & Observability
    col3 = patches.FancyBboxPatch((0.67, 0.08), 0.27, 0.78, boxstyle="round,pad=0.01",
                                  facecolor="#fff8e1", edgecolor="#ffd54f", linewidth=1.0)
    ax.add_patch(col3)
    ax.text(0.805, 0.82, "CLIENT & OBSERVABILITY", ha="center", fontsize=8.5, fontweight="bold", color="#f57f17")

    services_c3 = [
        ("AWS Amplify", "Zero-Config Web Hosting"),
        ("React / Next.js Client", "Quiet Converse UI & Vault"),
        ("Amazon Polly", "Dev/Testing Speech Quota"),
        ("Amazon Cognito", "Role Separation (I1)"),
        ("Amazon CloudWatch", "Immutable Audit Logs (I4)")
    ]
    y_pos = 0.72
    for s_name, s_desc in services_c3:
        s_box = patches.FancyBboxPatch((0.69, y_pos - 0.08), 0.23, 0.09, boxstyle="round,pad=0.01",
                                       facecolor="white", edgecolor="#ffe082", linewidth=0.8)
        ax.add_patch(s_box)
        ax.text(0.805, y_pos - 0.02, s_name, ha="center", fontsize=7.5, fontweight="bold")
        ax.text(0.805, y_pos - 0.06, s_desc, ha="center", fontsize=6.5, color="#555555")
        y_pos -= 0.13

    # Inter-column arrows
    ax.annotate("", xy=(0.36, 0.45), xytext=(0.335, 0.45),
                arrowprops=dict(arrowstyle="->", lw=1.5, color="#37474f"))
    ax.annotate("", xy=(0.665, 0.45), xytext=(0.64, 0.45),
                arrowprops=dict(arrowstyle="<->", lw=1.5, color="#37474f"))

    plt.tight_layout()
    fig.savefig(out_dir / "fig3_architecture.pdf")
    fig.savefig(out_dir / "fig3_architecture.png")
    plt.close()
    print("Generated Fig 3 (System Architecture)")


# ==============================================================================
# FIGURE 4: FOUR-PHASE PIPELINE & CONSENT INVARIANTS BAND
# ==============================================================================
def generate_fig4():
    fig, ax = plt.subplots(figsize=(7.0, 3.2))
    ax.axis("off")
    
    ax.text(0.5, 0.96, "Fig. 4. Four-phase pipeline with underlying Consent Invariants Band (I1–I4)",
            ha="center", va="top", fontsize=10, fontweight="bold")

    # 4 Pipeline Phases
    phases = [
        ("Phase 1: Ingestion", "Raw voice, chat &\nbehavioral prompts\n(Encrypted S3)", "#e8f5e9", "#2e7d32"),
        ("Phase 2: Extraction", "ASR diarization &\nNLP Comprehend ->\nDynamoDB PIS S(p)", "#e3f2fd", "#1565c0"),
        ("Phase 3: Conversation", "DynamoDB retrieval\n& Humility-gated\nLlama-3-70B + Voice", "#ede7f6", "#512da8"),
        ("Phase 4: Interface", "Next.js Quiet UI,\nPersonality Vault &\nCompleteness score", "#fff3e0", "#e65100")
    ]
    
    x_pos = 0.04
    for title, desc, bg_color, border_color in phases:
        box = patches.FancyBboxPatch((x_pos, 0.38), 0.20, 0.46, boxstyle="round,pad=0.01",
                                     facecolor=bg_color, edgecolor=border_color, linewidth=1.2)
        ax.add_patch(box)
        ax.text(x_pos + 0.10, 0.77, title, ha="center", fontsize=8.0, fontweight="bold", color=border_color)
        ax.text(x_pos + 0.10, 0.57, desc, ha="center", fontsize=7.2, color="#333333")
        
        if x_pos < 0.70:
            ax.annotate("", xy=(x_pos + 0.24, 0.61), xytext=(x_pos + 0.205, 0.61),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#555555"))
        x_pos += 0.24

    # Consent Invariants Band (Bottom)
    band = patches.FancyBboxPatch((0.04, 0.08), 0.92, 0.22, boxstyle="round,pad=0.01",
                                  facecolor="#37474f", edgecolor="#263238", linewidth=1.2)
    ax.add_patch(band)
    ax.text(0.5, 0.24, "INFRASTRUCTURE CONSENT INVARIANTS BAND (Compiled into Architecture)",
            ha="center", fontsize=7.8, fontweight="bold", color="#eceff1")
    
    invariants = [
        "I1: Role Separation (Cognito)",
        "I2: Subject-Defined Expiry (TTL λ)",
        "I3: Primary Authorship (τ=0.70)",
        "I4: Auditability (CloudWatch)"
    ]
    x_inv = 0.08
    for inv in invariants:
        ax.text(x_inv, 0.14, inv, fontsize=7.0, color="#cfd8dc", fontweight="semibold")
        x_inv += 0.23

    plt.tight_layout()
    fig.savefig(out_dir / "fig4_pipeline.pdf")
    fig.savefig(out_dir / "fig4_pipeline.png")
    plt.close()
    print("Generated Fig 4 (Pipeline & Invariants Band)")


# ==============================================================================
# FIGURE 5: HUMAN EVALUATION BAR RATINGS WITH 95% CIs (IEEE FORMAT)
# ==============================================================================
def generate_fig5():
    fig, ax = plt.subplots(figsize=(5.5, 3.5))
    
    dimensions = ["Authenticity", "Relational\nAccuracy", "Uncanny-Valley\nResistance"]
    x = np.arange(len(dimensions))
    width = 0.24
    
    # Subject A Data from Paper
    # Means & 95% CI Half-Widths
    means_a = [2.74, 2.63, 2.88]  # Unconditioned
    ci_a    = [0.33, 0.30, 0.28]
    
    means_b = [3.10, 3.02, 3.12]  # Free-text
    ci_b    = [0.27, 0.25, 0.26]
    
    means_c = [4.21, 4.02, 4.11]  # Schema-conditioned
    ci_c    = [0.27, 0.26, 0.25]
    
    # Grayscale/IEEE compatible colors
    rects1 = ax.bar(x - width, means_a, width, yerr=ci_a, capsize=3, label="Condition A (Unconditioned)",
                    color="#e0e0e0", edgecolor="#333333", linewidth=0.8, error_kw=dict(lw=0.8, capthick=0.8))
    rects2 = ax.bar(x, means_b, width, yerr=ci_b, capsize=3, label="Condition B (Free-Text Profile)",
                    color="#9e9e9e", edgecolor="#333333", linewidth=0.8, error_kw=dict(lw=0.8, capthick=0.8))
    rects3 = ax.bar(x + width, means_c, width, yerr=ci_c, capsize=3, label="Condition C (Schema-Conditioned)",
                    color="#212121", edgecolor="#000000", linewidth=0.8, error_kw=dict(lw=0.8, capthick=0.8))
    
    ax.set_ylabel("Evaluation Rating (1–5 Likert Scale)")
    ax.set_title("Fig. 5. Mean Human Evaluation Ratings for Subject A (95% CIs)", pad=12, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(dimensions)
    ax.set_ylim(1.0, 5.2)
    ax.grid(axis="y", linestyle="--")
    ax.legend(loc="upper left", framealpha=0.9)

    # Statistical significance bracket for Authenticity
    x1, x2 = x[0] - width, x[0] + width
    y_bar = 4.65
    ax.plot([x1, x1, x2, x2], [y_bar - 0.08, y_bar, y_bar, y_bar - 0.08], lw=1.0, color="#111111")
    ax.text((x1 + x2) / 2, y_bar + 0.06, "*** p < .001 (Δ = +1.47)", ha="center", va="bottom", fontsize=7.5, fontweight="bold")

    plt.tight_layout()
    fig.savefig(out_dir / "fig5_human_ratings.pdf")
    fig.savefig(out_dir / "fig5_human_ratings.png")
    plt.close()
    print("Generated Fig 5 (Human Evaluation Bar Chart)")


# ==============================================================================
# FIGURE 6: COMPLETENESS VS AUTHENTICITY REGRESSION & HUMILITY ROUTING
# ==============================================================================
def generate_fig6():
    fig, ax = plt.subplots(figsize=(5.5, 3.5))
    
    completeness = np.array([0.28, 0.54, 0.81])
    authenticity = np.array([2.95, 3.65, 4.21])
    humility_pct = [61, 22, 4]
    labels = ["Subject C (Sparse)", "Subject B (Medium)", "Subject A (Rich)"]
    
    # Linear Regression Line
    slope, intercept = np.polyfit(completeness, authenticity, 1)
    x_line = np.linspace(0.20, 0.90, 100)
    y_line = slope * x_line + intercept
    
    ax.plot(x_line, y_line, color="#455a64", linestyle="--", linewidth=1.2, label=f"Fitted Trend (slope = +{slope:.2f})")
    
    # Scatter Points
    scatter = ax.scatter(completeness, authenticity, color="#0d47a1", s=70, edgecolor="#000000", zorder=4, label="Observed Subjects")
    
    # Annotate points with humility percentages
    for i, txt in enumerate(labels):
        ax.annotate(f"{txt}\nAuth: {authenticity[i]:.2f} | Humility: {humility_pct[i]}%",
                    (completeness[i], authenticity[i]),
                    xytext=(completeness[i] - 0.08, authenticity[i] + 0.18),
                    fontsize=7.8,
                    bbox=dict(boxstyle="round,pad=0.2", facecolor="#ffffff", edgecolor="#b0bec5", alpha=0.9),
                    arrowprops=dict(arrowstyle="->", lw=0.8, color="#37474f"))

    ax.set_xlabel("Schema Completeness Score: score(S) = coverage(K) · c̄(F)")
    ax.set_ylabel("Conditioned Authenticity Rating (1–5)")
    ax.set_title("Fig. 6. Authenticity vs. Completeness & Graceful Humility Degradation", pad=10, fontweight="bold")
    ax.set_xlim(0.15, 0.95)
    ax.set_ylim(2.5, 4.8)
    ax.grid(True, linestyle="--")
    ax.legend(loc="lower right")

    plt.tight_layout()
    fig.savefig(out_dir / "fig6_completeness_gradient.pdf")
    fig.savefig(out_dir / "fig6_completeness_gradient.png")
    plt.close()
    print("Generated Fig 6 (Completeness vs Authenticity Gradient)")


if __name__ == "__main__":
    generate_fig1()
    generate_fig2()
    generate_fig3()
    generate_fig4()
    generate_fig5()
    generate_fig6()
    print("\nAll 6 IEEE publication figures rendered successfully into paper/figures/.")
