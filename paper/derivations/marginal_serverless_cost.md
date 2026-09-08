# Marginal Serverless Cost Modeling & Free Tier Derivations

## 1. Mathematical Cost Formulation (Equation 2)

Let $S = \{\text{Lambda}, \text{DynamoDB}, \text{API Gateway}, \text{S3}, \text{Transcribe}, \text{Comprehend}, \text{CloudWatch}, \text{ElevenLabs}\}$ be the set of deployed cloud services.

The marginal cost $C$ of executing a single conversation turn is:

$$C = \sum_{s \in S} u_s \cdot q_s$$

Where:
- $u_s$: Per-conversation resource usage of service $s$.
- $q_s$: Marginal unit price of service $s$ beyond its free tier allocation.

---

## 2. On-Demand Pricing Decomposition

| Service $s$ | Resource Metric ($u_s$) | Unit Price ($q_s$) | Marginal Cost / Conversation ($u_s q_s$) |
| :--- | :--- | :--- | :--- |
| **ElevenLabs TTS** | 120 characters synthesized | $\$0.000075$ / char | **$\$0.0090$** ($75.0\%$ of total) |
| **AWS Lambda** | 1 invocation (128 MB, $220\text{ms}$) | $\$0.0000166667$ / GB-s | **$\$0.0012$** |
| **Amazon DynamoDB** | 1 Read Request Unit (RRU) | $\$0.00025$ / 1000 RRUs | **$\$0.0008$** |
| **Amazon API Gateway**| 1 REST API call | $\$3.50$ / 1,000,000 calls | **$\$0.0006$** |
| **Amazon S3** | 1 GetObject request | $\$0.0004$ / 1,000 requests | **$\$0.0004$** |
| **Amazon CloudWatch**| 1 Log event appended | $\$0.50$ / GB ingested | **$\$0.0000$** ($< \$0.0001$) |
| **Total Marginal Cost**| — | — | **$\mathbf{\$0.012}$ USD / turn** |

---

## 3. Quota Economics & AWS Free Tier Analysis

During the evaluation pilot and for typical family usage ($< 500$ conversation turns per month):

$$\forall s \in S, \quad \sum_{\text{pilot}} u_s \le \text{Quota}_{\text{FreeTier}}(s) \implies C_{\text{actual}} = \mathbf{\$0.00 \text{ (₹0.00 INR)}}$$

### Free Tier Capacity Breakdown:
1. **AWS Lambda**: $1,000,000$ free invocations/month $\implies \approx 33,000$ conversations/day.
2. **Amazon DynamoDB**: $25\text{ GB}$ storage + $25\text{ WCU} / 25\text{ RCU}$ free $\implies \approx 200,000,000$ schema reads/month.
3. **Amazon API Gateway**: $1,000,000$ API calls/month free for 12 months.
4. **Amazon S3**: $5\text{ GB}$ standard storage free $\implies \approx 5,000$ voice notes (60s MP3 @ $1\text{MB}$).
5. **Amazon Transcribe**: $60\text{ minutes}$ free/month $\implies 60$ full onboarding audio clips.
6. **Amazon Comprehend**: $50,000\text{ text units}$ free/month $\implies \approx 500$ onboarding profile extractions.

---

## 4. Comparison to Server-Based Architectures

Prior digital afterlife prototypes deploy dedicated virtual machines (e.g., AWS EC2 `t3.medium` or GPU instances `g4dn.xlarge`):
- **Server-Based Baseline Cost**: $\$45.00 - \$380.00 / \text{month}$ in persistent idle compute, regardless of user interaction.
- **Evoke Serverless Architecture**: $100\%$ zero-idle architecture. Total monthly cost scales strictly to zero ($\$0.00$) when no queries are active.
