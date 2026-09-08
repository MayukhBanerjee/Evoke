# Aggregated Benchmark Results & Cloud Telemetry

This document compiles the quantitative evaluation metrics derived from the `Evoke` digital legacy architecture, serving as a rapid-reference appendix for research presentation and replication.

## 1. Automated Faithfulness & Relevance (RAGAS Adaptation)
Evaluated using a calibrated two-judge configuration (Llama-3-70B-Instruct & Gemini-1.5-Pro) against 30 manually verified ground-truth human annotations.
- **Inter-Judge Cohen's $\kappa$:** $0.71$
- **Judge-Human Spearman $\rho$:** $0.82$

| Condition | Faithfulness | Answer Relevance | Context Recall | Confident Fabrication Rate |
| :--- | :--- | :--- | :--- | :--- |
| **A (Unconditioned Baseline)** | $0.45$ | $0.52$ | $0.38$ | **$15.3\%$** |
| **B (Free-text Profile)** | $0.72$ | $0.68$ | $0.65$ | $8.4\%$ |
| **C (Schema-conditioned Evoke)** | **$0.88$** | **$0.85$** | **$0.82$** | **$2.0\%$** |

## 2. Human Subject Evaluation (Authenticity)
Evaluated by 30 raters familiar with the public subjects (Subject A). Metric is a 1-5 Likert scale for perceived authenticity.
- **Inter-Rater Reliability (Fleiss' $\kappa$):** $0.64$

| Metric | Value | 95% Confidence Interval |
| :--- | :--- | :--- |
| **Mean Authenticity (Cond. C)** | $4.21$ | $[3.94, 4.48]$ |
| **Mean Authenticity (Cond. A)** | $2.74$ | $[2.41, 3.07]$ |
| **Wilcoxon Signed-Rank Test** | $p < .001$ | N/A |
| **Cohen's $d$** | $1.31$ | N/A |
| **Rank-Biserial Correlation $r$** | $0.78$ | N/A |

## 3. Epistemic Humility Routing & The Completeness Gradient
Demonstrates how the humility threshold ($\tau = 0.70$) prevents hallucination when data is sparse.

| Subject | Schema Richness | Completeness Score | Humility Routing Frequency | Authenticity Score (Cond. C) |
| :--- | :--- | :--- | :--- | :--- |
| **Subject A** | Rich (42 fields) | $0.81$ | **$4.0\%$** | $4.21$ |
| **Subject B** | Medium (24 fields) | $0.54$ | **$22.0\%$** | $3.67$ |
| **Subject C** | Sparse (12 fields) | $0.28$ | **$61.0\%$** | $2.95$ |

*Conclusion:* The architecture degrades gracefully, mathematically scaling its modesty (from 4% to 61% routing frequency) as source material thins.

## 4. Serverless Cloud Performance Telemetry
Data collected over AWS Lambda, DynamoDB, and API Gateway for the complete retrieval and generation loop.

### Latency Profiles
| Operation Phase | Median ($p50$) | $p95$ Percentile | Notes |
| :--- | :--- | :--- | :--- |
| **Lambda Cold Start** | $450\text{ms}$ | $820\text{ms}$ | Includes Python dependency loading |
| **Lambda Warm Start** | $120\text{ms}$ | $180\text{ms}$ | Standard event orchestration |
| **DynamoDB Retrieval (Sparse)** | $4.1\text{ms}$ | $6.2\text{ms}$ | Validates invariant $I_1$ speed |
| **DynamoDB Retrieval (Rich)** | $6.5\text{ms}$ | $9.4\text{ms}$ | Sub-10ms performance holds |
| **End-to-End Conversation** | $1600\text{ms}$ | $2800\text{ms}$ | Includes LLM Time-to-First-Token |

### Concurrency Load Throughput
| Concurrent Users | Success Rate | Mean Latency | Bottleneck Trigger |
| :--- | :--- | :--- | :--- |
| **1 User** | $100\%$ | $1600\text{ms}$ | None |
| **10 Users** | $98\%$ | $1950\text{ms}$ | Minor queuing at Groq API |
| **25 Users** | $91\%$ | $2800\text{ms}$ | Upstream LLM rate limiting begins |
| **50 Users** | $67\%$ | $10500\text{ms}$ | Hard LLM API Timeout |

*Note:* Backend DynamoDB and Lambda scaled perfectly to 50 concurrent requests. The only bottlenecks emerged from the third-party LLM inference limits, not the Evoke schema topology.
