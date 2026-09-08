---
title: "A Simple Model of Structured Personality Preservation in Digital Legacy Systems"
authors: 
  - Mayukh Banerjee, Vellore Institute of Technology
  - Vedant Patel, Vellore Institute of Technology
---

# Abstract
Digital afterlife systems consistently reduce the deceased to what the literature describes as a fragmented caricature. We argue that this is a consequence of unstructured personalization applied to the most sensitive data a family can hold, and we propose a structural remedy at the level of data representation. Rather than relying on raw model scale, our system generates responses from a structured schema of typed behavioral fields, where each field carries a confidence score derived from supporting evidence. Where evidence is insufficient, the system invokes an epistemic humility protocol, defaulting to acknowledged uncertainty rather than fabricating plausible yet ungrounded opinions. We present Evoke, a consent-first serverless architecture implementing this schema, rigorously constrained by four topological invariants enforced at the service layer. Through a 4050-point evaluation matrix across three subjects of varying data richness, we demonstrate that schema-conditioned responses receive a mean authenticity rating of 4.21 on a 5-point Likert scale, significantly outperforming the unconditioned baseline of 2.74 ($p < .001$, Cohen's $d = 1.31$). Crucially, the occurrence of confidently fabricated opinions drops from 15.3% to 2.0%. Real-world cloud telemetry establishes that the consent invariants impose negligible latency overhead, maintaining sub-10ms retrieval times at a marginal cost of $0.012 per conversational query. Our findings indicate that mitigating the posthumous caricature effect depends fundamentally on structured behavioral extraction rather than parameter expansion.

---

# I. Introduction
The advent of generative language models has catalyzed a rapidly expanding class of digital legacy platforms, often colloquially termed "griefbots," designed to synthesize conversational agents from the digital residue of the deceased. Commercial platforms and research prototypes alike typically function by ingesting extensive exports of messages, audio recordings, and personal documents into a retrieval-augmented generation (RAG) pipeline or via direct fine-tuning. 

Despite architectural variations, empirical studies of these systems report a consistent failure mode. Bereaved users reliably characterize the generated outputs as emotionally dissonant, frequently manifesting as generic, synthetic mimicry that distorts the subject's fundamental personality. The literature diagnoses this phenomenon as a "fragmented caricature"—a systemic degradation where the subject is reduced to generalized tropes. Clinical assessments emphasize the severity of this distortion; given that approximately 10% of bereaved adults experience prolonged grief disorder, inaccurate digital representations pose active clinical risks rather than serving as therapeutic instruments.

We diagnose this failure as fundamentally structural. Existing paradigms conflate acoustic or stylistic replication with behavioral replication. By passing unstructured documents directly to a language model, these systems implicitly assume that authentic personality will spontaneously emerge from raw textual mass. It does not. Furthermore, post-mortem consent in contemporary architectures is largely treated as an administrative policy layer rather than a topological constraint, leaving sensitive legacy data vulnerable to configuration errors or corporate acquisition.

In this paper, we introduce **Evoke**, an architecture constructed upon two explicit design constraints:
1. **Behavioral Structured Identity:** Personality is formalized not as a corpus of text, but as a computable schema of scored behavioral fields.
2. **Topological Consent:** Ethical requirements are enforced as immutable infrastructure invariants rather than software policies.

### Contributions
1. We formalize the **Personality Ingestion Schema (PIS)**, a mathematical tuple defining behavioral extraction, and empirically validate its automated extraction pipeline against a manual ground truth (achieving a macro-averaged $F_1$ score of 0.734).
2. We present **Lemma 1**, proving the monotonicity of the completeness indicator used during schema construction, incentivizing robust data aggregation.
3. We conduct a rigorous, pre-registered three-condition evaluation (30 raters, 4050 data points, Fleiss' $\kappa = 0.64$) demonstrating that the schema paradigm increases perceived authenticity by 1.47 points ($p < .001$) and effectively suppresses hallucinated opinions via an epistemic humility threshold.
4. We characterize the performance of the serverless AWS pipeline, establishing that consent-by-design operates with sub-10ms database retrieval and near-zero marginal latency overhead.

---

# II. Theoretical Model and Methodology

## A. Formalizing the Personality Ingestion Schema

Let $p$ represent a subject, and let $D = \{d_1, d_2, \dots, d_m\}$ denote the multi-modal digital legacy corpus containing voice recordings, chat exports, and responses to structured relational prompts. We define the Personality Ingestion Schema of $p$ as the 4-tuple:

$$S(p) = (F, c, \tau, \lambda)$$

Where $F = \{f_1, f_2, \dots, f_n\}$ is a set of discrete behavioral fields. Each field $f_i$ is a 3-tuple $f_i = (k_i, v_i, e_i)$:
- $k_i \in K$: A key drawn from a strict behavioral taxonomy (e.g., humour style, relational tone).
- $v_i$: A succinct descriptor summarizing the behavioral instinct.
- $e_i = (\mu_i, t_i, \sigma_i)$: The provenance evidence dictating the modality, timestamp, and specific citation offset.

## B. The Confidence Scoring Function

To prevent ungrounded generation, each field requires empirical validation. The confidence function $c : F \to [0, 1]$ maps each behavioral field to a scalar quantifying its empirical support:

$$c(f_i) = \min\left(1.0, \, \left(1 - e^{-\alpha n_i}\right) \cdot \gamma(e_i) \cdot \text{agr}(f_i)\right)$$

Where $n_i$ represents the number of corroborating citations, $\alpha$ is the convergence learning rate, $\gamma(e_i)$ assigns modality reliability weights, and $\text{agr}(f_i)$ computes cross-source semantic agreement.

## C. The Completeness Indicator (Lemma 1)

During ingestion, the system displays a completeness metric: $\text{score}(S) = \text{coverage}(K) \cdot \overline{c(F)}$. 

**Lemma 1 (Monotonicity of Completeness).** A new data contribution strictly increases $\text{score}(S)$ if and only if it covers a key in $K$ not previously covered, or strictly raises $c(f_i)$ for an existing field.
*Proof.* Coverage is non-decreasing relative to the set of keys, and $c(f_i)$ is non-decreasing relative to the volume and agreement of corroborating evidence. The product of two positive, non-decreasing factors increases precisely when at least one factor strictly increases.

## D. Epistemic Humility Routing

The central mechanism addressing the caricature effect is the epistemic humility threshold ($\tau$). Given a query $q$, the context $C(q)$ is retrieved. The model generation $G$ operates conditionally:

$$y \sim \begin{cases} G(q, C(q)), & \text{if } \text{conf}(q, S) \ge \tau \\ h \oplus G(q, C(q), \phi), & \text{if } \text{conf}(q, S) < \tau \end{cases}$$

If query confidence falls below $\tau = 0.70$, the system prepends the humility preface $h$ (e.g., "I'm not entirely certain, but knowing me..."), explicitly acknowledging its limitations rather than hallucinating confidence.

---

# III. Serverless Architecture and Topological Consent

Evoke is constructed as an event-driven AWS pipeline comprising ten microservices. 

### Consent Invariants
Ethical mandates are mapped to topological constraints:
1. **$I_1$ (Role Separation):** All read paths strictly traverse the Cognito identity service; no backend bypass exists.
2. **$I_2$ (Subject-Defined Expiry):** The lifetime $\lambda$ is enforced as a native DynamoDB Time-to-Live (TTL) attribute, guaranteeing autonomous cryptographic erasure.
3. **$I_3$ (Primary Authorship):** The humility routing rule acts as a cryptographic signature of verifiable intent.
4. **$I_4$ (Auditability):** Immutable CloudWatch event trails record all context generation events.

### Cloud Performance Benchmarks
We model the marginal cost per conversation as $C = \sum u_s q_s$. At current on-demand pricing, the execution cost evaluates to exactly $\$0.012$ per conversation. 
Load testing reveals that the $I_2$ invariants impose negligible overhead: DynamoDB retrieval latency remains heavily bounded at $4.1\text{ms}$ (p50) and $6.2\text{ms}$ (p95) for a sparse schema, and scales seamlessly to $9.4\text{ms}$ (p95) for a saturated 42-field schema.

---

# IV. Evaluation Results

## A. Human Subject Evaluation
A pre-registered panel of 30 evaluators familiar with the subjects assessed responses across three conditions: unconditioned baseline (A), free-text profile (B), and schema-conditioned (C). 
For the heavily documented Subject A, condition C achieved a mean authenticity of 4.21 (95% CI [3.94, 4.48]), compared to 3.10 for B and 2.74 for A. This differential is statistically profound ($W$ test $p < .001$, Cohen's $d = 1.31$, rank-biserial $r = 0.78$), definitively confirming our central hypothesis. 

## B. Automated LLM-as-a-Judge and RAGAS Metrics
Using a calibrated two-judge configuration ($\kappa = 0.71$, Spearman $\rho = 0.82$), we quantified architectural faithfulness.
Condition C achieved a faithfulness metric of 0.88, compared to 0.45 in Condition A. Crucially, the epistemic humility routing ($\tau = 0.70$) reduced confidently fabricated opinions from 15.3% in the unstructured baseline down to a residual 2.0% in the schema architecture. 

## C. The Completeness Gradient
A distinct systems property emerged during testing: architectural degradation is remarkably graceful. For the sparsely documented Subject C (completeness 0.28), 61% of queries were safely routed to the humility preface, compared to just 4% for Subject A. Rather than hallucinating blindly when data is scarce, Evoke mathematically scales its modesty.

---

# V. Conclusion
By re-framing posthumous personality from a pure language-modeling problem into a structured, confidence-scored schema retrieval problem, we have demonstrated that the fragmented caricature effect can be systematically dismantled. Evoke establishes that computational epistemic humility, paired with topologically enforced consent invariants, yields a digital legacy architecture that is both emotionally authentic and profoundly ethical.
