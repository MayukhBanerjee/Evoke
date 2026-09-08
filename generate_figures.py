"""
Evoke Research Paper — Figure Generation Script
Produces 6 publication-ready figures for Elsevier Procedia submission.
Uses only matplotlib, numpy, and os.
"""

import os
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe

# ── Output directory ──────────────────────────────────────────────────────────
OUTPUT_DIR = "evoke_figures"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Colour palette ────────────────────────────────────────────────────────────
BLUE       = "#2C5F8A"
DARK_GREY  = "#333333"
MED_GREY   = "#888888"
LIGHT_GREY = "#DDDDDD"
WHITE      = "#FFFFFF"
RED_LINE   = "#CC0000"

matplotlib.rcParams['font.family'] = 'DejaVu Sans'


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 1 — Prior Work vs Evoke pipeline comparison
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig1():
    fig, ax = plt.subplots(figsize=(12, 5))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    # ── horizontal divider ────────────────────────────────────────────────────
    ax.axhline(y=2.5, xmin=0, xmax=1, color=LIGHT_GREY, linewidth=1.5, zorder=1)

    # ─ helper: draw a box + return its centre x ───────────────────────────────
    def draw_box(ax, x_left, y_bottom, width, height, text,
                 edge_color='black', face_color=LIGHT_GREY, fontsize=9):
        rect = FancyBboxPatch((x_left, y_bottom), width, height,
                               boxstyle="round,pad=0.04",
                               linewidth=1.2, edgecolor=edge_color,
                               facecolor=face_color, zorder=3)
        ax.add_patch(rect)
        ax.text(x_left + width / 2, y_bottom + height / 2, text,
                ha='center', va='center', fontsize=fontsize,
                color=DARK_GREY, zorder=4,
                multialignment='center')
        return x_left + width / 2   # centre x

    # ═══ TOP ROW — Prior Work ═════════════════════════════════════════════════
    y_top_mid = 3.75
    bh = 0.90
    bw = 1.80
    gap = 0.30

    # Row label
    ax.text(0.15, y_top_mid, "Prior Work",
            fontsize=11, fontweight='bold', color=DARK_GREY,
            ha='left', va='center', zorder=4)

    x_start = 1.30
    boxes_top = [
        ("Raw Documents\nVoice / Messages", 'black', LIGHT_GREY),
        ("Language Model",                  'black', LIGHT_GREY),
        ("Generic Response\n(Caricature)",  'black', LIGHT_GREY),
    ]
    centres_top = []
    cx = x_start
    for txt, ec, fc in boxes_top:
        draw_box(ax, cx, y_top_mid - bh/2, bw, bh, txt,
                 edge_color=ec, face_color=fc)
        centres_top.append(cx + bw/2)
        cx += bw + gap

    # arrows between boxes
    cx2 = x_start
    for i in range(len(boxes_top) - 1):
        ax.annotate('', xy=(cx2 + bw + gap, y_top_mid),
                    xytext=(cx2 + bw, y_top_mid),
                    arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.4), zorder=5)
        cx2 += bw + gap

    # below last top box
    last_top_cx = x_start + (bw + gap) * 2 + bw/2
    ax.text(last_top_cx, y_top_mid - bh/2 - 0.28, "✗",
            fontsize=18, fontweight='bold', color='red',
            ha='center', va='top', zorder=6)

    # ═══ BOTTOM ROW — Evoke ═══════════════════════════════════════════════════
    y_bot_mid = 1.25
    bw5 = 1.60
    gap5 = 0.22
    x_start5 = 1.10

    ax.text(0.15, y_bot_mid, "Evoke",
            fontsize=11, fontweight='bold', color=BLUE,
            ha='left', va='center', zorder=4)

    boxes_bot = [
        ("Raw Documents\nVoice / Messages",               BLUE, WHITE),
        ("Schema Extraction\n(Transcribe + Comprehend)",  BLUE, WHITE),
        ("Personality Ingestion\nSchema",                  BLUE, "#EEF3F8"),
        ("Language Model",                                 BLUE, WHITE),
        ("Authentic Response",                             BLUE, WHITE),
    ]
    cx5 = x_start5
    centres_bot = []
    box_rights_bot = []
    for txt, ec, fc in boxes_bot:
        draw_box(ax, cx5, y_bot_mid - bh/2, bw5, bh, txt,
                 edge_color=ec, face_color=fc, fontsize=9)
        centres_bot.append(cx5 + bw5/2)
        box_rights_bot.append(cx5 + bw5)
        cx5 += bw5 + gap5

    # arrows
    for i in range(len(boxes_bot) - 1):
        ax.annotate('', xy=(box_rights_bot[i] + gap5, y_bot_mid),
                    xytext=(box_rights_bot[i], y_bot_mid),
                    arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.4), zorder=5)

    # below last bottom box
    last_bot_cx = centres_bot[-1]
    ax.text(last_bot_cx, y_bot_mid - bh/2 - 0.28, "✓",
            fontsize=18, fontweight='bold', color='#2E7D32',
            ha='center', va='top', zorder=6)

    plt.tight_layout(pad=0.4)
    fig.savefig(os.path.join(OUTPUT_DIR, "fig1.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig1.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 2 — Personality Ingestion Schema card
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig2():
    fig, ax = plt.subplots(figsize=(14, 9))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    # outer card border
    card = FancyBboxPatch((0.3, 0.3), 13.4, 8.4,
                           boxstyle="round,pad=0.05",
                           linewidth=1.5, edgecolor=DARK_GREY,
                           facecolor=WHITE, zorder=1)
    ax.add_patch(card)

    # title
    ax.text(7, 8.35, "Personality Ingestion Schema — Subject A",
            fontsize=13, fontweight='bold', color=DARK_GREY,
            ha='center', va='center', zorder=4)
    ax.text(7, 7.95, "Completeness Score: 0.81 | Lifetime \u03bb: Subject-defined TTL",
            fontsize=10, color=MED_GREY, ha='center', va='center', zorder=4)

    # separator below subtitle
    ax.plot([0.5, 13.5], [7.65, 7.65], color=LIGHT_GREY, lw=1.2, zorder=3)

    col_left  = 0.55
    col1_w    = 3.5
    col2_x    = col_left + col1_w + 0.2
    col2_w    = 5.0
    col3_x    = col2_x + col2_w + 0.2
    col3_w    = 4.0

    rows = [
        ("Humour Style",          "Dry, self-deprecating; deflects with irony",        0.82, BLUE,      "0.82"),
        ("Advice Tone",           "Tough love; directness over comfort",                0.91, BLUE,      "0.91"),
        ("Signature Phrases",     "knowing me, I'd probably... / let's be honest",     0.71, BLUE,      "0.71"),
        ("Topic Stances",         "Career: high conviction / Failure: philosophical",  0.74, BLUE,      "0.74"),
        ("Relational Tone",       "Warm-teasing family; formal with strangers",        0.69, "#AAAAAA", "0.69 \u2193"),
        ("Relationship-Specific", "To daughter: protective / To colleagues: Socratic", 0.65, "#AAAAAA", "0.65 \u2193"),
    ]

    n_rows   = len(rows)
    row_h    = (7.65 - 0.55) / n_rows
    tau      = 0.70
    bar_x0   = col3_x
    bar_maxw = col3_w - 0.6

    for i, (field, desc, val, fill_c, lbl) in enumerate(rows):
        y_top = 7.65 - i * row_h
        y_bot = y_top - row_h
        y_mid = (y_top + y_bot) / 2
        below_threshold = val < tau

        if below_threshold:
            bg = mpatches.Rectangle((0.35, y_bot + 0.02), 13.1, row_h - 0.04,
                                     linewidth=0, facecolor="#FFF5F5", zorder=2)
            ax.add_patch(bg)

        if i > 0:
            ax.plot([0.5, 13.5], [y_top, y_top], color=LIGHT_GREY, lw=0.8, zorder=3)

        ax.text(col_left, y_mid, field,
                fontsize=10, fontweight='bold', color=DARK_GREY,
                ha='left', va='center', zorder=5)

        ax.text(col2_x, y_mid, desc,
                fontsize=9.5, style='italic', color=DARK_GREY,
                ha='left', va='center', zorder=5)

        bar_bg = mpatches.Rectangle((bar_x0, y_mid - 0.12), bar_maxw, 0.24,
                                      linewidth=0.8, edgecolor=LIGHT_GREY,
                                      facecolor=LIGHT_GREY, zorder=4)
        ax.add_patch(bar_bg)

        bar_fill = mpatches.Rectangle((bar_x0, y_mid - 0.12), val * bar_maxw, 0.24,
                                        linewidth=0, facecolor=fill_c, zorder=5)
        ax.add_patch(bar_fill)

        ax.text(bar_x0 + bar_maxw + 0.08, y_mid, lbl,
                fontsize=8.5, color=DARK_GREY, ha='left', va='center', zorder=6)

    # vertical threshold dashed line
    tau_x      = bar_x0 + tau * bar_maxw
    y_line_top = 7.65
    y_line_bot = 7.65 - n_rows * row_h
    ax.plot([tau_x, tau_x], [y_line_bot, y_line_top],
            color=RED_LINE, lw=1.3, linestyle='--', zorder=7)
    ax.text(tau_x + 0.05, y_line_top - 0.05, "\u03c4 = 0.70",
            fontsize=9, color=RED_LINE, ha='left', va='top', zorder=8)

    ax.text(col_left, y_line_bot - 0.18,
            "Fields below \u03c4 = 0.70 are routed to humility expression",
            fontsize=9, style='italic', color=RED_LINE, ha='left', va='top', zorder=5)

    fig.savefig(os.path.join(OUTPUT_DIR, "fig2.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig2.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 3 — System Architecture diagram (3 columns)
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig3():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    bw  = 2.4
    bh  = 0.70
    gap = 0.38

    def draw_box3(cx, cy, text):
        rect = FancyBboxPatch((cx - bw/2, cy - bh/2), bw, bh,
                               boxstyle="round,pad=0.08",
                               linewidth=1.3, edgecolor=BLUE,
                               facecolor=WHITE, zorder=3)
        ax.add_patch(rect)
        ax.text(cx, cy, text, ha='center', va='center',
                fontsize=9, color=DARK_GREY, zorder=4, multialignment='center')

    def v_arrow(x, y_start, y_end, label=''):
        ax.annotate('', xy=(x, y_end + bh/2), xytext=(x, y_start - bh/2),
                    arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.5), zorder=5)
        if label:
            ax.text(x + 0.14, (y_start + y_end) / 2, label,
                    fontsize=7.5, color=MED_GREY, ha='left', va='center', zorder=5)

    def add_phase_bracket(cx, ys, label):
        y_top_b = ys[0] + bh/2
        y_bot_b = ys[-1] - bh/2
        bx = cx - bw/2 - 0.25
        ax.plot([bx, bx], [y_bot_b, y_top_b], color=MED_GREY, lw=1.5)
        ax.plot([bx, bx + 0.12], [y_top_b, y_top_b], color=MED_GREY, lw=1.5)
        ax.plot([bx, bx + 0.12], [y_bot_b, y_bot_b], color=MED_GREY, lw=1.5)
        ax.text(bx - 0.08, (y_top_b + y_bot_b)/2, label,
                fontsize=8, color=MED_GREY, ha='right', va='center', rotation=90)

    # ═══ COLUMN 1 ════════════════════════════════════════════════════════════
    cx1  = 2.5
    top1 = 9.4
    ax.text(cx1, top1, "Ingestion Pipeline",
            fontsize=11, fontweight='bold', color=BLUE, ha='center', va='center')

    col1_texts = [
        "Amazon S3\nEncrypted Vault",
        "AWS Lambda\nIngestion Orchestrator",
        "Amazon Transcribe\nSpeaker Diarization",
        "Amazon Comprehend\nNLP Extraction",
        "Amazon DynamoDB\nPersonality Profile Store",
    ]
    col1_arrow_labels = ["S3 Event Trigger", "", "Transcript", "Schema Fields"]
    col1_ys = []
    y = top1 - 0.65
    for txt in col1_texts:
        draw_box3(cx1, y, txt)
        col1_ys.append(y)
        y -= (bh + gap)

    for i in range(len(col1_ys) - 1):
        v_arrow(cx1, col1_ys[i], col1_ys[i+1], label=col1_arrow_labels[i])

    add_phase_bracket(cx1, col1_ys, "Phase 1 & 2")

    # ═══ COLUMN 2 ════════════════════════════════════════════════════════════
    cx2 = 7.2
    ax.text(cx2, top1, "Conversation Layer",
            fontsize=11, fontweight='bold', color=BLUE, ha='center', va='center')

    col2_texts = [
        "Amazon Cognito\nJWT Auth + Role Separation",
        "Amazon API Gateway\nAuthenticated REST",
        "AWS Lambda\nConversation Orchestrator",
        "RAG Prompt Engine\nSchema Retrieval",
        "Groq API\nLlama-3-70B-Instruct",
        "ElevenLabs\nVoice Synthesis",
    ]
    col2_ys = []
    y = top1 - 0.65
    for txt in col2_texts:
        draw_box3(cx2, y, txt)
        col2_ys.append(y)
        y -= (bh + gap)

    for i in range(len(col2_ys) - 1):
        v_arrow(cx2, col2_ys[i], col2_ys[i+1])

    add_phase_bracket(cx2, col2_ys, "Phase 3")

    # Fallback box (from Groq at index 4)
    fallback_cx = cx2 + bw/2 + 1.6
    fallback_cy = col2_ys[4]
    draw_box3(fallback_cx, fallback_cy, "Gemini 1.5\n(Fallback)")
    ax.annotate('', xy=(fallback_cx - bw/2, fallback_cy),
                xytext=(cx2 + bw/2, fallback_cy),
                arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.2,
                                linestyle='dashed'), zorder=5)
    ax.text((cx2 + bw/2 + fallback_cx - bw/2)/2, fallback_cy + 0.18,
            "Auto-failover", fontsize=8, color=MED_GREY, ha='center', va='bottom')

    # ═══ COLUMN 3 ════════════════════════════════════════════════════════════
    cx3 = 12.2
    ax.text(cx3, top1, "Frontend & Observability",
            fontsize=11, fontweight='bold', color=BLUE, ha='center', va='center')

    # Amplify at ElevenLabs level, CloudWatch at Lambda level
    draw_box3(cx3, col2_ys[5], "AWS Amplify\nReact Frontend")
    draw_box3(cx3, col2_ys[2], "Amazon CloudWatch\nAudit Trail (I4)")

    add_phase_bracket(cx3, [col2_ys[2], col2_ys[5]], "Phase 4")

    # ── Inter-column arrows ───────────────────────────────────────────────────
    # DynamoDB → Lambda Orchestrator
    ax.annotate('', xy=(cx2 - bw/2, col2_ys[2]),
                xytext=(cx1 + bw/2, col1_ys[4]),
                arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.3,
                                connectionstyle='arc3,rad=-0.15'), zorder=5)
    ax.text((cx1 + cx2)/2, (col1_ys[4] + col2_ys[2])/2 + 0.15,
            "Retrieve Schema <10ms", fontsize=7.5, color=MED_GREY, ha='center', va='bottom')

    # ElevenLabs → Amplify
    ax.annotate('', xy=(cx3 - bw/2, col2_ys[5]),
                xytext=(cx2 + bw/2, col2_ys[5]),
                arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.3), zorder=5)
    ax.text((cx2 + cx3)/2, col2_ys[5] + 0.12, "Audio Stream",
            fontsize=7.5, color=MED_GREY, ha='center', va='bottom')

    # Lambda → CloudWatch (dashed)
    ax.annotate('', xy=(cx3 - bw/2, col2_ys[2]),
                xytext=(cx2 + bw/2, col2_ys[2]),
                arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.2,
                                linestyle='dashed'), zorder=5)
    ax.text((cx2 + cx3)/2 + 0.5, col2_ys[2] + 0.12, "Audit Log (I4)",
            fontsize=7.5, color=MED_GREY, ha='center', va='bottom')

    fig.savefig(os.path.join(OUTPUT_DIR, "fig3.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig3.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 4 — Swim-lane process diagram
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig4():
    fig, ax = plt.subplots(figsize=(14, 8))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8)
    ax.axis('off')

    label_w = 1.55
    bw      = 2.0
    bh      = 0.72
    h_gap   = 0.28

    consent_bar_h = 0.70
    consent_y     = 0.20

    consent_bar = mpatches.Rectangle((0.10, consent_y), 13.80, consent_bar_h,
                                      linewidth=0, facecolor=BLUE, zorder=3)
    ax.add_patch(consent_bar)
    ax.text(7.0, consent_y + consent_bar_h / 2,
            "(I1) Role Separation | (I2) Subject-Defined Expiry | "
            "(I3) Primary Authorship | (I4) Auditability",
            fontsize=10, fontweight='bold', color=WHITE,
            ha='center', va='center', zorder=4)

    ax.text(7.0, consent_y + consent_bar_h + 0.10,
            "Consent Invariants — enforced at infrastructure level across all phases",
            fontsize=8, color=BLUE, ha='center', va='bottom', zorder=4)

    lanes_data = [
        {"label": "Phase 1\nSoul Ingestion",
         "boxes": ["Voice / Text /\nExports Uploaded",
                   "Amazon S3\nEncrypted Storage",
                   "Lambda\nTriggered"]},
        {"label": "Phase 2\nPersonality Extraction",
         "boxes": ["Amazon Transcribe\nSpeaker Diarization",
                   "Amazon Comprehend\nNLP Signals",
                   "Schema Builder Lambda\nPopulates DynamoDB"]},
        {"label": "Phase 3\nConditioned Conversation",
         "boxes": ["Family Query\nSubmitted",
                   "Cognito Auth +\nProfile Retrieval",
                   "RAG Prompt\nConstruction",
                   "Groq LLM +\nElevenLabs Voice"]},
        {"label": "Phase 4\nMinimal Interface",
         "boxes": ["Onboarding UI\nCompleteness Score",
                   "Personality Vault\nSchema Viewer",
                   "Conversation Surface\nVoice Playback"]},
    ]

    n_lanes = len(lanes_data)
    total_lane_area_h = 8.0 - (consent_y + consent_bar_h + 0.30) - 0.30
    lane_h  = total_lane_area_h / n_lanes
    top_of_lanes = 8.0 - 0.22

    for li, lane in enumerate(lanes_data):
        y_top = top_of_lanes - li * lane_h
        y_bot = y_top - lane_h
        y_mid = (y_top + y_bot) / 2

        if li > 0:
            ax.plot([0, 14], [y_top, y_top], color=LIGHT_GREY, lw=1.0, zorder=2)

        ax.text(label_w / 2, y_mid, lane["label"],
                fontsize=10, fontweight='bold', color=DARK_GREY,
                ha='center', va='center', multialignment='center', zorder=4)

        boxes    = lane["boxes"]
        n_boxes  = len(boxes)
        total_w  = n_boxes * bw + (n_boxes - 1) * h_gap
        avail_w  = 14.0 - label_w - 0.30
        x_offset = label_w + 0.15 + (avail_w - total_w) / 2

        box_centres = []
        cx = x_offset
        for bi, txt in enumerate(boxes):
            rect = FancyBboxPatch((cx, y_mid - bh/2), bw, bh,
                                   boxstyle="round,pad=0.04",
                                   linewidth=1.2, edgecolor=DARK_GREY,
                                   facecolor=WHITE, zorder=3)
            ax.add_patch(rect)
            ax.text(cx + bw/2, y_mid, txt,
                    ha='center', va='center', fontsize=9,
                    color=DARK_GREY, zorder=4, multialignment='center')
            box_centres.append(cx + bw/2)
            cx += bw + h_gap

        for bi in range(len(boxes) - 1):
            x_s = box_centres[bi]   + bw/2
            x_e = box_centres[bi+1] - bw/2
            ax.annotate('', xy=(x_e, y_mid), xytext=(x_s, y_mid),
                        arrowprops=dict(arrowstyle='->', color=DARK_GREY, lw=1.3), zorder=5)

    fig.savefig(os.path.join(OUTPUT_DIR, "fig4.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig4.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 5 — Grouped bar chart (Human Evaluation Results)
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig5():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    groups   = ["Authenticity", "Relational\nAccuracy", "Uncanny-Valley\nResistance"]
    n_groups = len(groups)

    cond_A_vals = [2.74, 2.63, 2.88]
    cond_B_vals = [3.10, 2.90, 3.05]
    cond_C_vals = [4.21, 4.02, 4.11]
    cond_A_errs = [0.33, 0.31, 0.30]
    cond_B_errs = [0.27, 0.26, 0.27]
    cond_C_errs = [0.27, 0.25, 0.26]

    bar_w = 0.22
    x_centers = np.arange(n_groups) * (3 * bar_w + 0.28 + 0.10)

    xA = x_centers - bar_w
    xB = x_centers
    xC = x_centers + bar_w

    eb_kw = dict(fmt='none', elinewidth=1, capsize=4, capthick=1, ecolor='black', zorder=5)

    ax.bar(xA, cond_A_vals, width=bar_w, color='#BBBBBB', label='Condition A (Unconditioned)',      zorder=3)
    ax.errorbar(xA, cond_A_vals, yerr=cond_A_errs, **eb_kw)

    ax.bar(xB, cond_B_vals, width=bar_w, color=MED_GREY,  label='Condition B (Free-text profile)',  zorder=3)
    ax.errorbar(xB, cond_B_vals, yerr=cond_B_errs, **eb_kw)

    ax.bar(xC, cond_C_vals, width=bar_w, color=BLUE,       label='Condition C (Schema-conditioned)', zorder=3)
    ax.errorbar(xC, cond_C_vals, yerr=cond_C_errs, **eb_kw)

    # significance markers — group 0 (Authenticity)
    g0 = 0
    y_A_top = cond_A_vals[g0] + cond_A_errs[g0]
    y_B_top = cond_B_vals[g0] + cond_B_errs[g0]
    y_C_top = cond_C_vals[g0] + cond_C_errs[g0]

    bracket_top_AC = y_C_top + 0.40
    for xp, yp in [(xA[g0], y_A_top + 0.05), (xC[g0], y_C_top + 0.05)]:
        ax.plot([xp, xp], [yp, bracket_top_AC - 0.06], color=DARK_GREY, lw=1.0)
    ax.plot([xA[g0], xC[g0]], [bracket_top_AC, bracket_top_AC], color=DARK_GREY, lw=1.0)
    ax.text((xA[g0] + xC[g0])/2, bracket_top_AC + 0.04, "***",
            ha='center', va='bottom', fontsize=11, fontweight='bold', color=DARK_GREY)

    bracket_top_BC = y_C_top + 0.12
    for xp, yp in [(xB[g0], y_B_top + 0.05), (xC[g0], y_C_top + 0.05)]:
        ax.plot([xp, xp], [yp, bracket_top_BC - 0.05], color=DARK_GREY, lw=1.0)
    ax.plot([xB[g0], xC[g0]], [bracket_top_BC, bracket_top_BC], color=DARK_GREY, lw=1.0)
    ax.text((xB[g0] + xC[g0])/2, bracket_top_BC + 0.04, "***",
            ha='center', va='bottom', fontsize=11, fontweight='bold', color=DARK_GREY)

    ax.set_ylim(1.0, 5.5)
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.yaxis.grid(True, color=LIGHT_GREY, linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
    ax.set_ylabel("Mean Rating (1\u20135 Likert Scale)", fontsize=11)
    ax.set_xticks(x_centers)
    ax.set_xticklabels(groups, fontsize=11)
    ax.set_title("Human Evaluation Results — Subject A (n = 30 evaluators)",
                 fontsize=12, fontweight='bold', pad=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(DARK_GREY)
    ax.spines['bottom'].set_color(DARK_GREY)

    legend = ax.legend(loc='upper left', frameon=True, fontsize=9,
                       edgecolor=LIGHT_GREY, facecolor=WHITE)
    legend.get_frame().set_linewidth(0.8)

    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "fig5.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig5.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# FIGURE 6 — Scatter + regression
# ═══════════════════════════════════════════════════════════════════════════════
def make_fig6():
    fig, ax = plt.subplots(figsize=(8, 6.5))
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    xs = np.array([0.28, 0.54, 0.81])
    ys = np.array([2.95, 3.65, 4.21])

    coeffs = np.polyfit(xs, ys, 1)
    poly   = np.poly1d(coeffs)
    x_line = np.linspace(0.0, 1.0, 200)

    ax.scatter(xs, ys, s=160, facecolor=BLUE, edgecolors='black',
               linewidths=1.5, zorder=5)
    ax.plot(x_line, poly(x_line), linestyle='--', color=BLUE,
            linewidth=1.8, alpha=0.7, zorder=4)

    ax.axhline(y=4.0, linestyle='--', color='#AAAAAA', linewidth=1.0, zorder=3)
    ax.text(0.98, 4.03, "High authenticity\nthreshold",
            fontsize=8, color=MED_GREY, ha='right', va='bottom', zorder=5)

    annotations = [
        (0.28, 2.95, "Subject C\n(sparse)\n61% humility routing"),
        (0.54, 3.65, "Subject B\n(medium)\n22% humility routing"),
        (0.81, 4.21, "Subject A\n(rich)\n4% humility routing"),
    ]
    for xi, yi, lbl in annotations:
        ax.annotate(lbl, xy=(xi, yi), xytext=(xi + 0.03, yi + 0.05),
                    fontsize=9, color=DARK_GREY, va='bottom')

    ax.text(0.62, 2.1,
            "Routing frequency reflects\nhumility threshold \u03c4 = 0.70",
            fontsize=8, color=MED_GREY, style='italic', ha='left', va='bottom', zorder=5)

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(1.5, 5.0)
    ax.set_xticks([0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
    ax.set_yticks([2, 3, 4, 5])
    ax.set_xlabel("Schema Completeness Score", fontsize=11)
    ax.set_ylabel("Mean Authenticity \u2014 Condition C (1\u20135 scale)", fontsize=11)
    ax.set_title("Conditioned Authenticity vs Schema Completeness",
                 fontsize=12, fontweight='bold', pad=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(DARK_GREY)
    ax.spines['bottom'].set_color(DARK_GREY)
    ax.grid(True, color=LIGHT_GREY, alpha=0.4, zorder=0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "fig6.png"),
                dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print("  fig6.png saved")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print(f"Generating figures -> {OUTPUT_DIR}/")

    make_fig1()
    make_fig2()
    make_fig3()
    make_fig4()
    make_fig5()
    make_fig6()

    print("\nVerification:")
    all_ok = True
    for i in range(1, 7):
        fname = os.path.join(OUTPUT_DIR, f"fig{i}.png")
        if os.path.isfile(fname):
            size_kb = os.path.getsize(fname) / 1024
            print(f"  fig{i}.png -- {size_kb:.1f} KB")
        else:
            print(f"  fig{i}.png -- MISSING!")
            all_ok = False

    if all_ok:
        print("\nAll 6 figures saved to evoke_figures/ -- ready for Evoke paper insertion.")
    else:
        print("\nERROR: some figures were not saved correctly.")
