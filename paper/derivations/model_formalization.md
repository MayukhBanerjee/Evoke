# Personality Ingestion Schema (PIS) Model Formalization

## 1. Mathematical Definition

Let $p$ represent an individual subject and let $D = \{d_1, d_2, \dots, d_m\}$ denote the multi-modal digital legacy corpus provided by the subject (while living) or the family (posthumously). $D$ contains voice recordings ($d^{\text{audio}}$), text/chat exports ($d^{\text{chat}}$), personal writings/letters ($d^{\text{text}}$), and responses to structured relational prompts ($d^{\text{prompt}}$).

The **Personality Ingestion Schema (PIS)** of subject $p$ is defined as the 4-tuple:

$$S(p) = (F, c, \tau, \lambda)$$

---

## 2. Component Specifications

### 2.1. Typed Behavioral Fields ($F$)
$$F = \{f_1, f_2, \dots, f_n\}$$
Each discrete field $f_i$ is a 3-tuple:
$$f_i = (k_i, v_i, e_i)$$

Where:
- **Taxonomic Key $k_i \in K$**: Drawn from a fixed, closed taxonomy of five behavioral dimensions:
  $$K = \{\text{humour\_style}, \text{advice\_tone}, \text{signature\_phrases}, \text{relational\_tone}, \text{topic\_stances}\}$$
- **Behavioral Descriptor $v_i \in \mathcal{V}$**: A concise textual summary capturing how the person responded, their instinctive tone, or recurring linguistic habit.
- **Provenance Evidence $e_i = (\mu_i, t_i, \sigma_i)$**:
  - $\mu_i \in \{\text{audio}, \text{chat}, \text{prompt}, \text{letter}\}$: Source modality.
  - $t_i \in \mathbb{R}^+$: ISO timestamp of original creation.
  - $\sigma_i$: Specific citation offset / transcript snippet.

---

### 2.2. Confidence Scoring Function ($c$)
The confidence function $c : F \to [0, 1]$ maps each behavioral field $f_i$ to a scalar value quantifying its empirical support:

$$c(f_i) = \min\left(1.0, \, \left(1 - e^{-\alpha n_i}\right) \cdot \gamma(e_i) \cdot \text{agr}(f_i)\right)$$

Where:
- $n_i$: Number of independent corroborating citations in $D$.
- $\alpha > 0$: Convergence learning rate parameter ($\alpha = 0.5$).
- $\gamma(e_i) \in [0.8, 1.0]$: Modality reliability weight ($\gamma(\text{prompt}) = 1.0$, $\gamma(\text{audio}) = 0.95$, $\gamma(\text{chat}) = 0.85$).
- $\text{agr}(f_i) \in [0, 1]$: Cross-source semantic agreement factor computed via embedding cosine similarity.

---

### 2.3. Epistemic Humility Threshold ($\tau$)
$$\tau = 0.70$$
The hyperparameter governing opinion fabrication suppression. If the aggregate query confidence $\text{conf}(q, S) < \tau$, the system dynamically shifts from confident expression to acknowledged uncertainty routing.

---

### 2.4. Data Lifetime ($\lambda$)
$$\lambda \in \mathbb{N} \cup \{\infty\}$$
Subject-defined epoch expiration timestamp enforced as a native Amazon DynamoDB Time-to-Live (TTL) attribute, guaranteeing autonomous cryptographic erasure upon expiration ($I_2$).
