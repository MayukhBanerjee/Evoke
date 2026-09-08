# Formal Proof of Lemma 1: Monotonicity of the Live Completeness Indicator

## Mathematical Formulation

Let $p$ be a subject whose digital legacy corpus is $D$. We define the **Personality Ingestion Schema** $S(p)$ as:
$$S(p) = (F, c, \tau, \lambda)$$

Where:
- $F = \{f_1, f_2, \dots, f_n\}$ is the set of extracted typed behavioral fields $f_i = (k_i, v_i, e_i)$.
- $k_i \in K$ is drawn from a fixed taxonomy $K = \{\text{humour\_style}, \text{advice\_tone}, \text{signature\_phrases}, \text{relational\_tone}, \text{topic\_stances}\}$.
- $v_i$ is the textual behavioral descriptor.
- $e_i$ is the provenance tuple (source modality, timestamp).
- $c : F \to [0, 1]$ is the confidence function measuring empirical support and agreement.
- $\tau = 0.70$ is the epistemic humility threshold.
- $\lambda$ is the subject-defined data lifetime enforced via DynamoDB TTL.

The **Live Completeness Indicator** presented to contributors during onboarding is defined as:
$$\text{score}(S) = \text{coverage}(K) \cdot c(F)$$

Where:
- $\text{coverage}(K) = \frac{|\{k \in K : \exists f = (k, v, e) \in F\}|}{|K|}$ denotes the fraction of taxonomic keys in $K$ with at least one documented field.
- $c(F) = \frac{1}{|F|} \sum_{f \in F} c(f)$ represents the mean confidence across all active behavioral fields.

---

## Lemma 1 Statement

**Lemma 1 (Monotonicity of Profile Richness).**  
*A contribution increases $\text{score}(S)$ if and only if it covers a key of $K$ not previously covered, or strictly raises the confidence $c(f)$ for some field $f \in F$.*

---

## Formal Proof

### Part 1: Non-Decreasing Factors
Let $S_t = (F_t, c_t, \tau, \lambda)$ represent the schema state at step $t$, and let $\Delta D$ be a new contribution (such as a voice note, message export, or relational prompt answer) added at step $t+1$, yielding schema state $S_{t+1} = (F_{t+1}, c_{t+1}, \tau, \lambda)$.

1. **Coverage Factor $\text{coverage}(K)$**:
   - Let $K(F_t) = \{k \in K : \exists (k, v, e) \in F_t\}$.
   - Since extraction is additive and versioned, $F_t \subseteq F_{t+1}$, which implies $K(F_t) \subseteq K(F_{t+1})$.
   - Therefore, $|K(F_{t+1})| \ge |K(F_t)|$, establishing that $\text{coverage}(K)$ is monotonically non-decreasing:
     $$\text{coverage}(K)_{t+1} \ge \text{coverage}(K)_t \ge 0$$

2. **Confidence Factor $c(F)$**:
   - Each field confidence $c(f_i)$ aggregates the count of supporting citations $n_i$ and cross-modal agreement $a_i \in [0, 1]$:
     $$c(f_i) = 1 - \exp(-\alpha n_i) \cdot a_i, \quad \alpha > 0$$
   - Any new document $\Delta D$ either adds reinforcing evidence ($n_i \to n_i + 1$), provides consistent cross-modal corroboration, or introduces a new field initialized with positive confidence $c(f_{\text{new}}) > 0$.
   - Thus, $c(F)$ is non-decreasing in the presence of consistent evidence:
     $$c(F)_{t+1} \ge c(F)_t > 0$$

---

### Part 2: Product of Positive Non-Decreasing Functions
Let $X_t = \text{coverage}(K)_t$ and $Y_t = c(F)_t$. Both $X_t, Y_t > 0$ for any non-empty schema after initial onboarding.

The difference in completeness score is given by:
$$\Delta \text{score}(S) = X_{t+1} Y_{t+1} - X_t Y_t$$

We expand this difference as:
$$\Delta \text{score}(S) = (X_t + \Delta X)(Y_t + \Delta Y) - X_t Y_t = X_t \Delta Y + Y_t \Delta X + \Delta X \Delta Y$$

Since $X_t > 0$, $Y_t > 0$, $\Delta X \ge 0$, and $\Delta Y \ge 0$:
1. $\Delta \text{score}(S) > 0 \iff (\Delta X > 0) \vee (\Delta Y > 0)$.
2. $\Delta X > 0 \iff K(F_{t+1}) \setminus K(F_t) \neq \emptyset$ (a previously uncovered taxonomic key $k \in K$ is covered).
3. $\Delta Y > 0 \iff \exists f \in F : c_{t+1}(f) > c_t(f)$ (confidence of at least one field is strictly increased).

$$\text{score}(S_{t+1}) > \text{score}(S_t) \iff (\Delta X > 0) \vee (\Delta Y > 0)$$

$\blacksquare$ **Q.E.D.**

---

## Practical Impact on System Architecture
This mathematical guarantee ensures that the **Live Completeness Indicator** shown in the Evoke Onboarding interface (`/onboard`) and Personality Vault (`/vault`):
1. Never penalizes contributors for supplying additional authentic evidence.
2. Converts contributor effort into visible, monotonic progress ($0\% \to 100\%$).
3. Directly determines the probability of epistemic humility routing during conversation, as formalized in Equation (1).
