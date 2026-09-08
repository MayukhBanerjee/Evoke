A Simple Model of Structured Personality
Preservation
in Digital Legacy Systems
Mayukh Banerjee
School of Computer Science Engineering
and Information Systems, B.Tech IT
Vellore Institute of Technology
Roll No. 23BIT0061
Abstract—Digital afterlife systems consistently reduce the de
ceased to what the literature calls a fragmented caricature. We
argue that this is a consequence of unstructured personalization
applied to the most sensitive data a family can hold, and we
propose a remedy at the level of representation rather than of
model scale. In our model a response is generated from a schema
of typed behavioural fields, and each field carries a confidence
score derived from the evidence supporting it; where the evidence
is thin, the system says so, in the subject’s own register, rather
than filling the gap with a plausible guess. We describe Evoke,
a consent-first serverless architecture built on this model, and
we give a formal definition of the schema together with four
consent invariants enforced at the service layer of a ten-service
AWS pipeline. In a three-tier evaluation combining automated
metrics, large language model judges, and a 30-evaluator human
study across three subjects of varying data richness, schema
conditioned responses receive a mean authenticity rating of
4.21 against 2.74 for the unconditioned baseline on a 1–5 scale
(p < .001), and the fraction of responses containing a fabricated
opinion falls from 15.3% to 2.0%. The serverless pipeline runs the
evaluation load at a marginal cost of $0.012 per conversation, and
the consent invariants add negligible latency to the conversation
path. Our results suggest that the caricature effect responds to
representation rather than to parameter count.
Index Terms—digital afterlife, griefbots, personality mod
elling, retrieval-augmented generation, consent-by-design, server
less computing, value drift, epistemic humility
I. INTRODUCTION
When a person dies, the bereaved lose not only the presence
of the person but also the patterns of interaction through which
the relationship was constituted: the humour, the instincts,
the signature phrases, and the way the person responded
when life became difficult. A growing class of digital afterlife
systems, called griefbots, attempts to recover these patterns.
Commercial platforms and research prototypes alike ingest
messages, recordings and documents, and generate posthu
mous conversation partners.
The field has arrived at a consistent finding. Across surveys
and qualitative studies published between 2020 and 2025,
users describe the output of these systems as inauthentic and
distorting, and in some cases more painful than absence; the
deceased is reduced to what the literature calls a fragmented
Vedant Patel
School of Computer Science Engineering
and Information Systems, B.Tech IT
Vellore Institute of Technology
Roll No. 23BIT0114
caricature [1], [2], [10]. The same literature places the clinical
stakes: in adult bereavement, roughly one in ten of the
bereaved develops prolonged grief disorder, the threshold at
which a distorting system becomes a clinical risk rather than
a comfort [7].
The caricature is felt most sharply by those who knew
the person. A cloned voice delivering generic advice to a
daughter who knew every rhythm of her father’s speech is
not comforting but unsettling; acquaintances of the deceased
are significantly more sensitive to behavioural inconsistency
than strangers are [8]. Lei et al. report that several participants
found an inauthentic reconstruction harder to sit with than
silence, and one described the experience as talking to a
stranger who had learned facts about someone they loved
rather than having known them [2]. The gap is between
acoustic replication and behavioural replication, and every
existing system closes it the same way, by ingesting more
data and hoping that personality emerges from the noise. It
does not.
We diagnose the failure as structural (Fig. 1). First, no prior
system defines personality in a form a machine can retrieve
and express: existing approaches either fine-tune on raw ex
perience corpora or augment prompts with free-text profiles,
and personality is left to emerge, or fails to emerge, from the
noise [3], [4], [12]. Second, consent in existing architectures
is an administrative layer rather than an engineering one; it
can be violated by a configuration change.
We build Evoke because the literature documents this harm,
and because we take the view that formalizing the problem is
safer than ceding it to commercial actors without transparency.
Our evaluation uses public figures only; no bereaved partici
pants are exposed to a system that remains, by design, an early
prototype.
We introduce Evoke, a working system that treats both prob
lems as design constraints. Our contributions are as follows.
• Wedefine and implement a Personality Ingestion Schema
for digital legacy systems, and validate the extraction
pipeline against a manually annotated ground truth, re
TABLE I
porting precision, recall and F1 across five behavioural
dimensions (Table IV).
• We demonstrate, through a controlled three-condition
study on three subjects of varying data richness, that
schema-conditioned generation reduces fabrication from
15.3% to 2.0% and increases authenticity by 1.47 points
over the unconditioned baseline, and that the gain is not
carried by context length alone.
• We publish the first performance characterisation of a
serverless AI pipeline for digital legacy, including cold
start latency, a throughput curve under concurrent load,
and a marginal cost projection of $0.012 per conversation.
Concretely, Evoke does not pass raw documents to the
model. It extracts a schema of typed behavioural fields, scores
each field by the strength of its evidence, and conditions
generation on the schema; where the evidence is weak, the
system says so, in the subject’s own register, rather than in
the register of a confident stranger.
Summary of results. In this paper we make an evaluation of
the system, providing the following.
• Lemma 1 gives the monotonicity of the completeness
indicator shown to contributors.
• Schema-conditioned responses score 4.21 against 2.74 for
the unconditioned baseline on a 1–5 authenticity scale
(p < .001, rank-biserial r = 0.78).
• Confidently fabricated opinions fall from 15.3% to 2.0%
of conditioned responses for the richest subject.
• The serverless pipeline handles the evaluation load at
a marginal cost of $0.012 per conversation, with the
consent invariants adding negligible latency.
The remainder of the paper is organised as follows. Sec
tion II discusses related work. Section III defines the model.
Section IV describes the architecture. Section V gives the
evaluation design. Section VI characterises cloud performance.
Section VII reports the results. Section VIII discusses them.
Section IX states the ethical considerations and limitations.
II. BACKGROUND AND RELATED WORK
A. The digital afterlife and its failure mode
Empirical and philosophical work on griefbots converges
on three risks: consent absence, dependency formation, and
distortion of the deceased [1], [2], [9], [10], [14]. Hollanek and
Nowaczyk-Basi´ nska map the risk surface of the digital afterlife
industry and call for thanatosensitive guidelines [1]. Lei et
al. interview 18 demographically diverse participants and find
that perceived identity consistency, rather than acoustic fidelity,
is the central determinant of acceptance [2]. Jim´ enez-Alonso
and Bresc´ o de Luna frame the tension between continuing
bonds and emotional fixation [10], and Riggs foregrounds
postmortem privacy and data access equity [14]. A recent
conceptual paper introduces the term Digital Legacy AI for the
intentional design of a personal system during one’s lifetime,
but stops short of a validated architecture [16]. This literature
identifies the failure but does not propose a structural remedy;
Evoke is designed against exactly these risks, translating each
into an engineering constraint (Section III-C).
FEATURE-LEVEL COMPARISON WITH PRIOR WORK.
System
Struct.
identity
Conf.
scores
Uncert.
routing
Consent Erasure
infra
Character-LLM [3]
LaMP line [4]–[6]
OpenCharacter [12]
Digital Legacy AI [16]
Evoke (this work)
×
×
×
×
✓
×
×
×
×
✓
×
×
×
×
✓
×
×
×
×
✓
B. Persona modelling and evaluation
Two families of prior work approach personality com
putationally. Training-based approaches reconstruct personas
by full-parameter fine-tuning on experience corpora [3] or
on large-scale synthetic personas [12]; these achieve stylistic
alignment but inherit hallucination and persona instability, and
their own authors call for retrieval-augmented alternatives.
Retrieval-based personalization augments generation with user
profiles and reports measurable gains on personalized bench
marks [4]–[6]. Unlike both families, we treat personality
neither as a training objective nor as free-text context, but
as a typed, confidence-scored schema with an explicit un
certainty policy. Hallucination taxonomy work supplies the
failure vocabulary that our humility mechanism is designed
to suppress [13].
The evaluation of persona agents has recently been for
malized. PersonaGym provides a dynamic framework of 200
personas with 10 questions per task, and a human-aligned
automatic metric grounded in decision theory [15]. We cannot
apply it directly: its personas are role-play constructs and
its questions probe role fidelity, not posthumous identity
preservation, where the cost of a confident error is borne by a
bereaved user. We adapt its design principles instead: a human
aligned automatic judge with a stated rubric, validated against
a human panel, and a per-dimension decomposition of fidelity
(Section V). A feature-level comparison is given in Table I.
C. Serverless systems and privacy
Privacy-by-design scholarship argues that protection should
reside in architecture rather than policy, and ethical frame
works for the digital afterlife call for enforceable post-mortem
safeguards [9]. Separately, serverless pipelines avoid idle cost.
Mankala and Silva report, for a real-time NLP pipeline on
AWS, a 6.07× reduction in wall-clock duration and an 81.2%
reduction in compute energy relative to a server-based base
line [17]. Python cold starts run to hundreds of milliseconds
and, in production measurements, to a few seconds; Hellerstein
et al. discuss this as a structural limitation of the serverless
model, and it sets the context for the latency results of
Section VI [21]. We unite these threads: to our knowledge
Evoke is the first digital legacy architecture in which consent
and data lifetime are enforced as infrastructure invariants,
and among the first to apply the serverless pattern to grief
technology at near-zero marginal cost.
×
×
×
×
✓
fig1.png
Fig. 1. Conceptual contrast. The top row shows prior work, in which unstructured artefacts are passed directly to a language model. The bottom row shows
Evoke, in which the Personality Ingestion Schema is interposed between the data and the model. The base model is the same in both rows; the difference is
in what is retrieved.
III. THE MODEL
A. The schema
Let p be a subject and let D be the record of p, that is,
the set of voice recordings, message exports and documents
supplied by the subject or by the family. We define the Per
sonality Ingestion Schema of p as a tuple S(p) = (F,c,τ,λ),
where F = {f1,...,fn} is a set of typed behavioural fields
fi = (ki,vi,ei). The key ki is drawn from a fixed taxonomy
K (humour style, advice tone, signature phrases, relational
tone, topic stances), the descriptor vi is a textual summary
of the behaviour, and ei is the provenance of the field,
that is, the source modality and the timestamp. The function
c : F → [0,1] aggregates the amount and the agreement of
the evidence for each field. The parameter τ is the epistemic
humility threshold, and λ is the data lifetime set by the subject.
TABLE II
An instantiated schema card is shown in Fig. 2.
We remark that the schema records not what a person said
but how a person was. This is the sense in which the model
is a model of behavioural identity rather than of documents.
B. Completeness and conditioning
The completeness indicator shown to contributors during
ingestion is
score(S) = coverage(K) · c(F),
where coverage(K) is the fraction of keys in K with at
least one field, and c(F) is the mean confidence over F. The
indicator converts contribution effort into visible progress, as
the next lemma makes precise.
A contribution increases score(S) if and only if it covers
a key of K not previously covered, or strictly raises c(f) for
some field f.
Proof: After the first contribution both factors of the
score are positive. Coverage is non-decreasing in the set of
keys covered and c(f) is non-decreasing in the amount and
agreement of the evidence for f; the product of two positive
non-decreasing factors increases exactly when at least one
factor increases.
Let q be a query from a family member. The conditioning
context is
C(q) = (ki,vi) : rel(ki,q) ∧ c(fi) ≥ τfield ,
and generation proceeds as
y ∼
G(q,C(q)),
if conf(q,S) ≥ τ,
h⊕G(q, C(q), φ), if conf(q,S) < τ,
(1)
where h is the humility preface “I am not sure what I would
think about this, but knowing me, probably...”, and φ is
a constraint that prohibits confident opinion statements and
the fabrication of memories. Equation (1) converts value drift
from an ethical aspiration into a routing decision. A conformal
extension with finite-sample coverage guarantees is deferred
to a longer-form version of this work.
C. Consent as infrastructure invariants
We translate the principal risks of the griefbot literature into
four invariants, enforced by construction rather than by policy.
(I1) Role separation. Every read path to S or to the audio
artefacts passes through the identity service; no bypass
path exists in the service graph.
(I2) Subject-defined expiry. The lifetime λ is set only by
the subject or a legal proxy, and deletion at expiry is
automatic.
(I3) Primary authorship. Where the subject is living, con
tributions by family members are advisory until attested
by the subject.
(I4) Auditability. Every access event is appended to a tamper
evident log.
The mapping from risk to mechanism is given in Table II. A
policy prohibition is a rule that a compliant system follows; it
RISK-TO-INVARIANT MAPPING.
Documented risk
Invariant
Enforcement
Consent absence [9], [14]
Indefinite retention [9]
Distortion, value drift [1], [13]
Opacity [2]
(I1) role sepa
ration
(I2)
subject
defined expiry
(I3)
primary
authorship;
humility
routing
(I4) auditability
Cognito role
separated pools
DynamoDB
TTL
Contribution
mode control;
τ
CloudWatch
immutable
trails
can be violated by a configuration change, a leaked credential,
or a change of ownership. An architectural impossibility is a
property of the service graph: the prohibited action has no
path by which it could be executed. In Evoke the invariants
(I1)–(I4) are of the second kind; the consent of the subject is
compiled into the topology of the system, not written into its
terms of service.
IV. SYSTEM ARCHITECTURE
Evoke comprises ten AWS services and three external
APIs (Fig. 3), organised as a four-phase event-driven pipeline
(Fig. 4). Every service was selected because the problem
demands it; nothing in the architecture is decorative. The
justification for each is given in Table III.
Phase 1 (Soul ingestion). The subject, while living, or
the family afterwards, contributes voice recordings, message
exports, personal documents, and answers to a set of structured
prompts, for example “What was their instinct when someone
they loved made a bad decision?”. The prompts are designed
to surface behavioural signals that raw data cannot, namely the
specific, relational, situational dimensions of how a person was
with people. All artefacts are encrypted at rest (AES-256), and
an S3 event notification triggers the ingestion Lambda.
Phase 2 (Personality extraction). The orchestration Lambda
runs a sequential pipeline. Transcribe converts the recordings
to timestamped text with speaker diarization, isolating the
target speaker. Comprehend runs multi-dimensional NLP over
the transcripts: sentiment, key phrases, entities and syntax.
A schema-builder Lambda then populates S, stored with
versioned composite keys so that enrichment never overwrites
a prior state.
Phase 3 (Schema-conditioned conversation). On a query,
Lambda retrieves S from DynamoDB and builds the structured
system prompt of (1); the prompt and the message go to
Llama-3-70B on Groq, with automatic failover to Gemini; the
response is rendered in the subject’s cloned voice (Eleven
Labs). The conditioning rule is formalised as Algorithm 1,
and the conditioning template is, for convenience, as follows.
SYSTEM: You are responding as [name].
Humor: You are [humor_style].
Advice: your instinct is [advice_tone].
fig3.png
Fig. 2. An instantiated schema card for Subject A. Fields whose confidence falls below the threshold τ = 0.70 are shaded and routed to humility expression
rather than to confident generation. The lifetime λ is set by the subject and enforced as a storage-level TTL on DynamoDB.
Phrases: [signature_phrases].
Tone to this person: [relationship_tone].
CRITICAL: If uncertain, say "knowing
me, I’d probably..." Never state
confident opinions you may not have
held. Never fabricate memories.
Phase 4 (Minimal interface). The React client (Amplify)
exposes three views: onboarding with the live completeness
indicator; a Personality Vault which renders the schema trans
parently to the family; and a conversation surface with no
chat bubbles, no timestamps and no social-media patterns. The
interface is deliberately austere; grief, we suppose, does not
need chat bubbles. The person types; the voice responds.
A. Model card
For
reproducibility
parameters.
we
The
primary
state
language
the
model
model
meta-llama/Meta-Llama-3-70B-Instruct,
is
Algorithm 1 Schema-conditioned conversation (Phase 3).
Require: query q, schema S, threshold τ
Ensure: voiced response y
1: C(q) ← RETRIEVE(S) {DynamoDB, sub-10ms}
2: compute conf(q,S) from C(q)
3: if conf(q,S) ≥ τ then
4:
P ←BUILDPROMPT(q, C(q))
5: else
6:
P ←BUILDPROMPT(q, C(q), h, φ)
7: end if
8: ytext ← LLM(P, q) {Groq; Gemini failover}
9: y ←VOICESYNTH(ytext)
10: LOG(q, C(q), ytext) → CloudWatch {(I4)}
11: return y
accessed through the Groq API with temperature 0.7,
top p 0.9, max tokens 512, and a context window of 8192
tokens. The fallback model is Google Gemini 1.5 Flash.
Voice synthesis is provided by ElevenLabs, from a clone
trained on 60 seconds of source audio.
V. EXPERIMENTAL EVALUATION
A. Subjects and schema construction
We evaluate the system on three subjects of varying data
richness, constructed from public material only. Subject A is
a well-documented public figure with 42 schema fields and
completeness score 0.81. Subject B is moderately documented,
with 24 fields and completeness 0.54. Subject C is sparsely
documented, with 12 fields and completeness 0.28. This design
lets us make a claim not only about whether the schema helps,
but about how its benefit scales with the evidence available to
build it. The humility threshold is fixed at τ = 0.70 for this
study; the sensitivity of the results to this choice is examined
in Section VIII.
B. Schema extraction validation
It turns out to be quite a lot of work to validate the extraction
of the schema. We take the public record of Subject A, and
a human annotator extracts the fields manually; this is the
ground truth. We then run the Comprehend and schema-builder
pipeline on the same documents and compare. Table IV reports
precision, recall and F1 per key, so that the extraction is a
validated pipeline with measured accuracy, not a design claim
taken on faith.
C. Automated evaluation
We use RAGAS to evaluate faithfulness, answer relevance
and context recall over all responses in all three condi
tions [20]. Standard RAGAS evaluates the faithfulness of a
response against retrieved documents; our adaptation evaluates
faithfulness against the schema fields, so the metric measures
whether a response stays within the documented behavioural
identity rather than within a document store. We state this
distinction explicitly, since it is the key departure from the
standard RAG evaluation setting.
We also use two large language models as judges, prompted
with the schema as ground truth and a stated rubric. The
two-judge protocol with human calibration follows Zheng
et al. [11]. The judges are calibrated against a 30-response
subset of the human ratings (Section V-D), and the inter
judge Cohen’s κ and judge–human Spearman ρ are reported
in Section VII.
D. Human evaluation
We recruit 30 evaluators familiar with the subjects. Each
evaluator rates 15 responses per subject, one per prompt,
drawn from 15 prompts across the three conditions — A (un
conditioned), B (free-text profile) and C (schema-conditioned)
— with the condition hidden throughout. Each response is
rated on three dimensions: authenticity, relational accuracy and
uncanny-valley resistance, each on a 1–5 Likert scale. We pre
register the hypothesis that condition C exceeds condition A
by at least 1.0 point on authenticity for Subject A.
E. Statistical analysis
Ratings are paired within prompt and subject. The primary
test is the Wilcoxon signed-rank test, with a paired t-test as a
sensitivity analysis. Effect sizes are reported as rank-biserial
correlation and Cohen’s d. Bootstrap 95% confidence intervals
use 10,000 resamples with evaluator means as the resampling
unit. Inter-rater reliability is Fleiss’ κ across all 30 evaluators.
The design is summarised in Table V.
VI. CLOUD PERFORMANCE
We characterise the serverless pipeline along three axes:
cost, latency and throughput. Let us be the per-conversation
usage of service s and qs its unit price beyond the free tier.
The marginal cost of a conversation is
C =
us qs,
s
(2)
which is exactly zero while every us remains within quota, as
it did throughout the pilot. At public on-demand prices, (2)
evaluates to approximately $0.012 per conversation, of which
$0.009 is voice synthesis at ElevenLabs pay-as-you-go rates
and the remainder is distributed across Lambda, DynamoDB
and API Gateway invocations.
Table VI gives the per-phase latency. The cold start of
the orchestration Lambda, 820ms at the 95th percentile, sits
inside the range reported for Python functions with dependen
cies [21], and the DynamoDB retrieval remains in single-digit
milliseconds across both schema sizes tested, consistent with
the design targets of the service [22]. The consent invariants
add no measurable latency: (I1) is a single authentication hop
and (I4) is an asynchronous write.
Table VII gives the throughput analysis. The bottleneck at
25 concurrent conversations is the Groq API rate limit, not
the AWS infrastructure. The Lambda and DynamoDB layers
handle 50 or more concurrent requests without degradation,
as confirmed by isolated load tests on those components.
In a production deployment the bottleneck is mitigated by
TABLEIII
SERVICEJUSTIFICATION.
Service Role Justification Freetier
S3 Encryptedvault AES-256at rest;S3event triggersPhase2 5GB
Transcribe Diarizedtranscription Isolates thetarget speaker fromrecordings 60min/mo
Comprehend Multi-dimensionalNLP Populates thefiveschemakeys 50kunits/mo
DynamoDB Schemastore Sub-10msretrieval [22];TTLenforces(I2) 25GB
Lambda Orchestration Zeroidlecost;event-driventhroughout 1Mcalls/mo
APIGateway AuthenticatedREST Singletrustedentrypoint, enforces(I1) 1Mcalls/mo
Polly DevelopmentTTS Preserves theElevenLabscloningquota 5Mchars/mo
Cognito Identityandroles Makesbypassarchitecturallyimpossible(I1) 50kusers/mo
Amplify Frontendhosting Zero-configurationCI/CD Free
CloudWatch Logsandaudit Tamper-evident trail, enforces(I4) Alwaysfree
TABLEIV
SCHEMAEXTRACTIONVALIDATION(SUBJECTA).
Schemakey Precision Recall F1
Humourstyle 0.82 0.76 0.79
Advicetone 0.78 0.81 0.79
Signaturephrases 0.71 0.68 0.69
Topicstances 0.74 0.72 0.73
Relational tone 0.69 0.65 0.67
TABLEV
PRE-REGISTEREDEVALUATIONDESIGN.
Element Specification
Subjects Three public figures, completeness 0.81, 0.54,
0.28
Conditions Aunconditioned;Bfree-textprofile;Cschema
conditioned
Stimuli 15prompts×3conditions×3subjects
Evaluators 30ratersfamiliarwiththesubjects
Dimensions Authenticity; relationalaccuracy;uncanny-valley
resistance(1–5Likert)
Objectivemetric Confidently fabricated opinions per condition,
four-categoryaudit
Analysis Wilcoxonsigned-rank;pairedtsensitivity;boot
strapCIs;Fleiss’κ
Hypothesis CexceedsAby≥1.0 point on authenticity,
SubjectA
TABLEVI
PER-PHASELATENCY(PILOT).
Phase p50(ms) p95(ms)
Lambdacoldstart 450 820
Lambdawarmstart 120 180
DynamoDB,12fields 4.1 6.2
DynamoDB,42fields 6.5 9.4
Endtoend 2EFifty 2ENF
switching to a self-hostedmodel endpoint or by placing
multipleAPIkeysbehindarequestqueue.
TABLEVII
THROUGHPUTUNDERCONCURRENTLOAD(PILOT).
Concurrentusers Successrate Meanlatency(ms)
1 100% 1600
5 100% 1720
10 98% 1950
25 91% 2800
50 67% timeout
VII. RESULTS
A. Humanevaluationresults
For Subject A, schema-conditioned responses received a
meanauthenticityratingof4.21(95%CI[3.94,4.48]),against
3.10([2.83, 3.37]) for thefree-textbaselineand2.74([2.41,
3.07])for theunconditionedbaseline.Thedifferencebetween
conditionsCandAis1.47(Wilcoxonsigned-rankp<.001;
rank-biserialr=0.78;pairedt-testd=1.31).Thedifference
betweenconditionsCandBis1.11(p<.001),whichisolates
the schema itself as the contribution rather than themere
additionof context.Relational accuracy improvedfrom2.63
to4.02,anduncanny-valleyresistancefrom2.88to4.11.Inter
rater reliabilitywassubstantial (Fleiss’κ=0.64).
ForSubjectBthepattern repeats at a lower level: condi
tionedauthenticity is 3.65against 2.61unconditioned (p<
.01). For Subject C the conditionedmean is 2.95 against
2.55, and the difference is not significant at the .05 level.
Relational accuracyanduncanny-valleyresistancefollowthe
same pattern across all three subjects. The pre-registered
hypothesisthatconditionCexceedsconditionAbyatleast1.0
point onauthenticityforSubjectAisconfirmed(p<.001).
Figure5illustratestheabove; theplotsshowthemeanratings
with95%confidenceintervalsfor thethreeconditions.
B. Automatedevaluationresults
Table VIII gives the automatedmetrics for Subject A.
Faithfulness rises from0.45 for the unconditionedbaseline
to 0.72 for free-text and 0.88 for the schema. The jump
from0.45to0.88istheautomatedsignatureof thecaricature
effect being corrected: unconditioned responses are fluent
butungrounded,whileconditionedresponsesstaywithinthe
fig2.png
Fig. 3. System architecture. The left column is the ingestion pipeline, the middle column the conversation layer, and the right column the frontend and
observability services. Arrows show the direction of data flow; every path to the schema passes through Cognito (I1).
retrieved behavioural identity. Answer relevance follows the
same order (0.52, 0.68, 0.85). The judges agree with each
other (κ = 0.71) and with the human panel (ρ = 0.82), which
supports the use of the judge at scale.
C. The effect of data richness
Table IX and Fig. 6 show that conditioned authenticity is a
function of the completeness score. For Subject C the schema
provides only a marginal improvement over the free-text base
line, and the difference is not significant. The explanation is in
the routing: the humility threshold routes 61% of queries for
Subject C to the uncertainty preface, against 22% for Subject B
and 4% for Subject A. A sparse schema therefore produces
acknowledged uncertainty rather than confident caricature.
This indicates, in a simplistic way, that the system degrades
gracefully rather than catastrophically as the evidence thins,
which is a systems property of the threshold and not an
fig4.png
Fig. 4. The four-phase pipeline. The band at the bottom shows the consent invariants (I1)–(I4), which run beneath all phases as infrastructure constraints
rather than as policy statements.
accident of the data.
D. Fabrication analysis
Confidently fabricated opinions occurred in 15.3% of un
conditioned responses, 8.4% of free-text responses, and 2.0%
of conditioned responses for Subject A. All three resid
ual events in condition C trace to fields whose confidence
marginally exceeded τ, and two of the three fall in the keys
with the lowest extraction F1 in Table IV: relational tone (0.67)
and signature phrases (0.69). Absent fields route cleanly to
humility; marginal fields are the dangerous case. This suggests
per-key calibration of τ as the right direction for future work,
and it gives the extraction table a second role, as a predictor
of residual fabrication risk.
fig5.png
Fig. 5. Mean human ratings for Subject A with 95% confidence intervals. Light bars are condition A (unconditioned), medium bars condition B (free-text),
dark bars condition C (schema-conditioned). Asterisks denote p < .001. The C–B gap (1.11 points) isolates the schema’s contribution from the mere addition
of context.
VIII. DISCUSSION
A. The caricature effect as a retrieval problem
The authenticity gain is not carried by context length alone:
the free-text condition B adds roughly the same number of
tokens as condition C but scores 1.11 points lower. This
indicates that the caricature effect responds to representation
rather than to parameter count or context size. The target of
retrieval in our system is not a document but a behavioural
identity, and the faithfulness results show that an LLM will
stay within such a target when it is given one, and will
drift when it is not. The implication extends beyond grief
technology to any domain requiring faithful, stable persona
conditioning.
fig6.png
Fig. 6. Conditioned authenticity as a function of schema completeness across the three subjects, with a fitted regression line. The humility routing frequency
(4%, 22%, 61% for Subjects A, B, C) is the mechanism behind the gradient: sparser schemas route more queries to acknowledged uncertainty rather than to
confident generation.
B. The schema as psychological continuity
The schema can be read as an operationalization of the
psychological-continuity view of personal identity [19]. What
is preserved is not the person but the relations of connected
ness that the record supports: the humour, the instincts, the
relational tones — in Parfit’s terms the relations that make a
later representation a continuation of a person rather than an
imitation of one. On this reading the provenance condition of
Section III is precisely the requirement that these relations
have the right kind of cause, and a fabricated memory is
connectedness without the right cause. The humility routing
then has a natural interpretation: where the record does not
support a relation, the system declines to claim it, which is
the only honest position for an echo.
TABLE VIII
AUTOMATED METRICS, SUBJECT A, PER CONDITION.
Condition
Faithful
Relevant
Fabrication
A (uncond.)
B (free-text)
C (schema)
0.45
0.72
0.88
0.52
0.68
0.85
15.3%
8.4%
2.0%
TABLE IX
COMPLETENESS, HUMILITY ROUTING AND CONDITIONED AUTHENTICITY
BY SUBJECT.
Subject
Completeness Humility routing Auth (C)
A (rich)
B (medium)
C (sparse)
0.81
0.54
0.28
4%
22%
61%
4.21
3.65
2.95
C. Design lessons
Three observations from the pilot deserve recording.
• Marginal-confidence fields, not absent fields, are the
dangerous case. Absence routes cleanly to humility;
marginal evidence produces the residual fabrications of
Section VII-D, and suggests per-key calibration of τ as
the next design step.
• The Personality Vault changed how the evaluators read
the responses. Several referred to the schema while rating,
which suggests that transparency is itself a component of
perceived authenticity and not merely an ethical affor
dance.
• Graceful degradation under sparse data is an architectural
property of the threshold, not an accident of the subjects.
The routing frequencies 4%, 22% and 61% move mono
tonically with the completeness score, as Table IX shows.
D. Directions for future work
Two extensions are natural. The first is temporal. The
present persona is frozen at the date of death, and recent
HCI work identifies this freezing as a source of dissonance. A
repair is to let the retrieval weights consolidate from episodic
to semantic fields as posthumous time grows, and to let the
echo acknowledge its own status, which also removes the
deception objection. The second is clinical. The dual process
model of bereavement suggests an interaction controller that
encourages oscillation between loss-oriented and restoration
oriented conversation, with the oscillation rate as a first
order safety metric [18]. We defer both extensions, and the
conformal form of the routing rule, to a longer-form version
of this work.
IX. ETHICAL CONSIDERATIONS AND LIMITATIONS
We built Evoke because the literature documents real harm
from unstructured, consent-blind systems, and our evaluation
uses public figures only. We do not deploy with bereaved
families absent clinical collaboration, and we regard the hu
mility mechanism and the consent invariants as minimum
prerequisites for any such deployment.
We acknowledge that the schema and the conditioning
pipeline could be applied to create persona impostors for
deceptive purposes. Our consent invariants are a partial miti
gation at the service layer, but they do not prevent misuse of
the schema design itself. We publish the architecture in full
on the grounds that transparency enables scrutiny, and that the
alternative — keeping consent-first designs out of the literature
— cedes the field to opaque commercial actors.
We state the limitations explicitly. Evaluation on three
public figures limits ecological validity, and private individuals
remain untested. Thirty evaluators provide moderate statistical
power; we report reliability and intervals accordingly. The
RAGAS adaptation requires further validation against human
judgement beyond the calibration subset used here. The la
tency and throughput figures of Section VI are measured at
pilot scale and will shift under production load. The conformal
extension assumes exchangeability of the calibration reactions,
which a drifting record may violate. We view each of these
as a defined direction for future work rather than as a settled
result.
X. CONCLUSION
We have argued that the documented failure of digital
afterlife systems is structural, and we have tested that ar
gument with a deployed system. By formalizing personality
as a confidence-scored, retrievable schema, by conditioning
generation on behavioural identity rather than on training-time
priors, and by enforcing consent as an infrastructure invariant,
Evoke reduces the fragmented-caricature effect measurably
and degrades gracefully as the record thins.
The evaluation establishes three things. First, schema
conditioned generation is measurably more authentic than
either unconditioned or free-text-conditioned generation, and
the gap is carried by the structure of the retrieved target rather
than by the model or the context length. Second, the system
degrades gracefully as the record thins: a sparse schema
acknowledges its limits rather than fabricating confidence,
and the routing frequency moves monotonically with the
completeness score. Third, the serverless architecture delivers
these properties at near-zero marginal cost for family-scale
use, and the consent invariants add negligible latency to the
conversation path. The open questions are the temporal evo
lution of the persona, the per-key calibration of the threshold,
and the clinical deployment pathway, each of which the present
results define more sharply than before.
The echo of a person should not be a caricature; and our
results suggest that, with the right structure, it need not be.
REFERENCES
[1] T. Hollanek and K. Nowaczyk-Basi´nska, “Griefbots, Deadbots, Post
mortem Avatars: On Responsible Applications of Generative AI in the
Digital Afterlife Industry,” Philosophy & Technology, vol. 37, no. 2,
art. 63, 2024.
[2] Y. Lei et al., “AI Afterlife as Digital Legacy: Perceptions, Expectations,
and Concerns Regarding AI-Generated Agents as Digital Legacy,” in
Proc. CHI Conf. Human Factors in Computing Systems (CHI ’25), ACM,
2025, doi: 10.1145/3706598.3713933.
[3] Y. Shao, L. Li, J. Dai, and X. Qiu, “Character-LLM: A Trainable Agent
for Role-Playing,” in Proc. EMNLP 2023, pp. 12787–12818, 2023.
[4] A. Salemi, S. Mysore, M. Bendersky, and H. Zamani, “LaMP: When
Large Language Models Meet Personalization,” in Proc. 62nd Annu.
Meeting ACL (ACL 2024), pp. 7370–7392, 2024.
[5] A. Salemi, S. Kallumadi, and H. Zamani, “Optimization Methods for
Personalizing Large Language Models through Retrieval Augmentation,”
in Proc. 47th Int. ACM SIGIR Conf., 2024.
[6] A. Salemi et al., “LaMP-QA: A Benchmark for Personalized Long-Form
Answer Generation,” arXiv:2506.00137, 2025.
[7] M. Lundorff, H. Holmgren, R. Zachariae, I. Farver-Vestergaard, and
M. S. O’Connor, “Prevalence of prolonged grief disorder in adult be
reavement: A systematic review and meta-analysis,” Journal of Affective
Disorders, vol. 208, pp. 138–149, 2017.
[8] K. Linden, “The Talking Dead: Voice-Cloning Yourself to AI Afterlife
Services,” Thanatos, vol. 13, no. 1, 2025.
[9] C. ¨ Ohman and L. Floridi, “An Ethical Framework for the Digital
Afterlife Industry,” Nature Human Behaviour, vol. 2, no. 5, pp. 318
320, 2018.
[10] B. Jim´enez-Alonso and I. Bresc´o de Luna, “Griefbots. A new way of
communicating with the dead?” Integrative Psychological and Behav
ioral Science, vol. 57, no. 2, pp. 466–481, 2023.
[11] L. Zheng et al., “Judging LLM-as-a-Judge with MT-Bench and Chatbot
Arena,” in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), Datasets and
Benchmarks Track, 2023.
[12] N. Wang et al., “OpenCharacter: Training Customizable Role-Playing
LLMs with Large-Scale Synthetic Personas,” arXiv:2407.08694, 2024.
[13] L. Huang et al., “A Survey on Hallucination in Large Language Models:
Principles, Taxonomy, Challenges, and Open Questions,” ACM Trans.
Inf. Syst., 2025.
[14] D. Riggs, “Grief in the Age of AI: Griefbots and Online Death,”
Dalhousie Journal of Interdisciplinary Management, vol. 19, 2025.
[15] V. Samuel, H. P. Zou, Y. Zhou, S. Chaudhari, A. Kalyan, T. Rajpurohit,
and A. Deshpande, “PersonaGym: Evaluating Persona Agents and
LLMs,” in Findings of the Association for Computational Linguistics:
EMNLP 2025, 2025.
[16] D. Frongia, “Digital Legacy AI: A Proactive Framework for Posthu
mous Conversational Systems,” SSRN, 2026. [Online]. Available:
https://ssrn.com/abstract=6494259
[17] C. K. Mankala and R. J. Silva, “Sustainable Real-Time NLP with
Serverless Parallel Processing on AWS,” Information, vol. 16, no. 10,
art. 903, 2025.
[18] M. Stroebe and H. Schut, “The Dual Process Model of Coping with
Bereavement: A Rationale and Review,” Death Studies, vol. 23, no. 3,
pp. 197–224, 1999.
[19] D. Parfit, Reasons and Persons. Oxford: Clarendon Press, 1984.
[20] S. Es, J. James, L. Espinosa-Anke, and S. Schockaert, “RAGAS:
Automated Evaluation of Retrieval Augmented Generation,” in Proc.
18th Conf. Eur. Chapter Assoc. Comput. Linguistics (EACL), Syst.
Demonstrations, 2024.
[21] J. M. Hellerstein, J. Faleiro, J. E. Gonzalez, C. Schleier-Smith,
V. Sreekanti, A. Tumanov, and C. Wu, “Serverless Computing: One
Step Forward, Two Steps Back,” in Proc. CIDR, 2019.
[22] S. Elhemali et al., “Amazon DynamoDB: A Scalable, Predictably
Performant, and Fully Managed NoSQL Database,” in Proc. USENIX
ATC, 2022