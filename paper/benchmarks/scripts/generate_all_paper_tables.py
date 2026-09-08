"""
generate_all_paper_tables.py — Generates all LaTeX tables (Tables I through IX) in strict IEEE format,
saving individual .tex files and a master compilable tables_master.tex into paper/tables/.
"""
from pathlib import Path

tables_dir = Path(__file__).resolve().parent.parent.parent / "tables"
tables_dir.mkdir(parents=True, exist_ok=True)

# Table I: Feature-level comparison with prior work
table1_tex = r"""% Table I: Feature-level comparison with prior work
\begin{table}[htbp]
\caption{Feature-Level Comparison with Prior Work.}
\label{tab:prior_work}
\centering
\begin{tabular}{lccccc}
\toprule
\textbf{System} & \textbf{Struct.} & \textbf{Conf.} & \textbf{Uncert.} & \textbf{Consent} & \textbf{Erasure} \\
 & \textbf{identity} & \textbf{scores} & \textbf{routing} & \textbf{infra} & \\
\midrule
Character-LLM [3]     & $\times$ & $\times$ & $\times$ & $\times$ & $\times$ \\
LaMP line [4]--[6]    & $\times$ & $\times$ & $\times$ & $\times$ & $\times$ \\
OpenCharacter [12]    & $\times$ & $\times$ & $\times$ & $\times$ & $\times$ \\
Digital Legacy AI [16]& $\times$ & $\times$ & $\times$ & $\times$ & $\times$ \\
\textbf{Evoke (this work)} & \textbf{\checkmark} & \textbf{\checkmark} & \textbf{\checkmark} & \textbf{\checkmark} & \textbf{\checkmark} \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table II: Risk-to-invariant mapping
table2_tex = r"""% Table II: Risk-to-invariant mapping
\begin{table}[htbp]
\caption{Risk-to-Invariant Mapping.}
\label{tab:risk_invariants}
\centering
\begin{tabular}{lll}
\toprule
\textbf{Documented risk} & \textbf{Invariant} & \textbf{Enforcement} \\
\midrule
Consent absence [9], [14]       & (I1) role separation         & Cognito role-separated pools \\
Indefinite retention [9]        & (I2) subject-defined expiry  & DynamoDB TTL ($\lambda$) \\
Distortion, value drift [1], [13]& (I3) primary authorship;    & Contribution-mode control; \\
                                & \hspace{1.5em} humility routing & $\tau = 0.70$ threshold \\
Opacity [2]                     & (I4) auditability            & CloudWatch immutable trails \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table III: Service justification
table3_tex = r"""% Table III: Service justification
\begin{table*}[htbp]
\caption{Service Justification and Free Tier Mapping.}
\label{tab:service_justification}
\centering
\begin{tabular}{lllc}
\toprule
\textbf{Service} & \textbf{Role} & \textbf{Justification} & \textbf{Free tier} \\
\midrule
S3          & Encrypted vault           & AES-256 at rest; S3 event triggers Phase 2        & 5 GB \\
Transcribe  & Diarized transcription    & Isolates the target speaker from recordings       & 60 min/mo \\
Comprehend  & Multi-dimensional NLP     & Populates the five schema keys                     & 50 k units/mo \\
DynamoDB    & Schema store              & Sub-10 ms retrieval [22]; TTL enforces (I2)        & 25 GB \\
Lambda      & Orchestration             & Zero idle cost; event-driven throughout            & 1 M calls/mo \\
API Gateway & Authenticated REST        & Single trusted entry point, enforces (I1)          & 1 M calls/mo \\
Polly       & Development TTS           & Preserves the ElevenLabs cloning quota             & 5 M chars/mo \\
Cognito     & Identity and roles        & Makes bypass architecturally impossible (I1)      & 50 k users/mo \\
Amplify     & Frontend hosting          & Zero-configuration CI/CD                           & Free \\
CloudWatch  & Logs and audit            & Tamper-evident trail, enforces (I4)                & Always free \\
\bottomrule
\end{tabular}
\end{table*}
"""

# Table IV: Schema extraction validation
table4_tex = r"""% Table IV: Schema extraction validation (Subject A)
\begin{table}[htbp]
\caption{Schema Extraction Validation (Subject A).}
\label{tab:schema_extraction}
\centering
\begin{tabular}{lccc}
\toprule
\textbf{Schema key} & \textbf{Precision} & \textbf{Recall} & \textbf{F1} \\
\midrule
Humour style        & 0.82 & 0.76 & 0.79 \\
Advice tone         & 0.78 & 0.81 & 0.79 \\
Signature phrases   & 0.71 & 0.68 & 0.69 \\
Topic stances       & 0.74 & 0.72 & 0.73 \\
Relational tone     & 0.69 & 0.65 & 0.67 \\
\midrule
\textbf{Macro Average} & \textbf{0.75} & \textbf{0.72} & \textbf{0.73} \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table V: Pre-registered evaluation design
table5_tex = r"""% Table V: Pre-registered evaluation design
\begin{table}[htbp]
\caption{Pre-Registered Evaluation Design.}
\label{tab:eval_design}
\centering
\begin{tabular}{lp{5.8cm}}
\toprule
\textbf{Element} & \textbf{Specification} \\
\midrule
Subjects          & Three public figures, completeness 0.81, 0.54, 0.28 \\
Conditions        & A unconditioned; B free-text profile; C schema-conditioned \\
Stimuli           & 15 prompts $\times$ 3 conditions $\times$ 3 subjects \\
Evaluators        & 30 raters familiar with the subjects \\
Dimensions        & Authenticity; relational accuracy; uncanny-valley resistance (1--5 Likert) \\
Objective metric  & Confidently fabricated opinions per condition, four-category audit \\
Analysis          & Wilcoxon signed-rank; paired $t$ sensitivity; bootstrap CIs; Fleiss' $\kappa$ \\
Hypothesis        & Condition C exceeds A by $\ge 1.0$ point on authenticity, Subject A \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table VI: Per-phase latency
table6_tex = r"""% Table VI: Per-phase latency (Pilot)
\begin{table}[htbp]
\caption{Per-Phase Latency (Pilot).}
\label{tab:latency}
\centering
\begin{tabular}{lcc}
\toprule
\textbf{Phase} & \textbf{p50 (ms)} & \textbf{p95 (ms)} \\
\midrule
Lambda cold start       & 450 & 820 \\
Lambda warm start       & 120 & 180 \\
DynamoDB, 12 fields     & 4.1 & 6.2 \\
DynamoDB, 42 fields     & 6.5 & 9.4 \\
End to end              & 1600 & 2800 \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table VII: Throughput under concurrent load
table7_tex = r"""% Table VII: Throughput under concurrent load (Pilot)
\begin{table}[htbp]
\caption{Throughput Under Concurrent Load (Pilot).}
\label{tab:throughput}
\centering
\begin{tabular}{ccc}
\toprule
\textbf{Concurrent users} & \textbf{Success rate} & \textbf{Mean latency (ms)} \\
\midrule
1   & 100\% & 1600 \\
5   & 100\% & 1720 \\
10  & 98\%  & 1950 \\
25  & 91\%  & 2800 \\
50  & 67\%  & timeout \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table VIII: Automated metrics, Subject A
table8_tex = r"""% Table VIII: Automated metrics, Subject A, per condition
\begin{table}[htbp]
\caption{Automated Metrics, Subject A, Per Condition.}
\label{tab:automated_metrics}
\centering
\begin{tabular}{lccc}
\toprule
\textbf{Condition} & \textbf{Faithful} & \textbf{Relevant} & \textbf{Fabrication} \\
\midrule
A (uncond.)    & 0.45 & 0.52 & 15.3\% \\
B (free-text)  & 0.72 & 0.68 & 8.4\% \\
C (schema)     & 0.88 & 0.85 & 2.0\% \\
\bottomrule
\end{tabular}
\end{table}
"""

# Table IX: Completeness, humility routing, and conditioned authenticity
table9_tex = r"""% Table IX: Completeness, humility routing and conditioned authenticity by subject
\begin{table}[htbp]
\caption{Completeness, Humility Routing and Conditioned Authenticity by Subject.}
\label{tab:completeness_gradient}
\centering
\begin{tabular}{lccc}
\toprule
\textbf{Subject} & \textbf{Completeness} & \textbf{Humility routing} & \textbf{Auth (C)} \\
\midrule
A (rich)   & 0.81 & 4\%  & 4.21 \\
B (medium) & 0.54 & 22\% & 3.65 \\
C (sparse) & 0.28 & 61\% & 2.95 \\
\bottomrule
\end{tabular}
\end{table}
"""

# Master LaTeX document
master_tex = r"""\documentclass[journal]{IEEEtran}
\usepackage{booktabs}
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{graphicx}

\title{Evoke: Complete Paper Tables (Tables I--IX)}
\author{Mayukh Banerjee and Vedant Patel}

\begin{document}
\maketitle

\section*{Master Tables Repository}

""" + "\n\n".join([
    table1_tex, table2_tex, table3_tex, table4_tex, table5_tex,
    table6_tex, table7_tex, table8_tex, table9_tex
]) + r"""

\end{document}
"""

files_to_save = {
    "table1_feature_comparison.tex": table1_tex,
    "table2_risk_to_invariants.tex": table2_tex,
    "table3_service_justification.tex": table3_tex,
    "table4_schema_extraction_validation.tex": table4_tex,
    "table5_preregistered_evaluation_design.tex": table5_tex,
    "table6_per_phase_latency.tex": table6_tex,
    "table7_throughput_concurrent_load.tex": table7_tex,
    "table8_automated_metrics_ragas.tex": table8_tex,
    "table9_completeness_humility_gradient.tex": table9_tex,
    "tables_master.tex": master_tex,
}

for fname, content in files_to_save.items():
    p = tables_dir / fname
    with open(p, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Generated {fname} -> {p}")

print("\nAll IEEE LaTeX tables successfully generated in paper/tables/.")
