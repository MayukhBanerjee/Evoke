import { PersonalityVault } from './types';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface ConversationResult {
  text: string;
  audioUrl?: string;
  latencyMs: number;
  humilityTriggered: boolean;
  schemaConfidence: number;
  modelUsed: string;
}

export interface EvaluationResults {
  authenticity: { evoke: number; baseline: number; delta: number; p_value: number; cohens_d: number };
  relational_accuracy: { evoke: number; baseline: number; delta: number };
  uncanny_valley_resistance: { evoke: number; baseline: number; delta: number };
  fabrication_rate: { evoke_pct: number; baseline_pct: number; reduction_pct: number };
  retrieval_latency_ms: { p95: number };
  groq_ttft_ms: { max: number };
  fleiss_kappa: number;
  infrastructure_cost_inr: number;
}

function schemaToVault(s: Record<string, unknown>): PersonalityVault {
  return {
    id: s.vault_id as string,
    name: s.name as string,
    relationship: s.relationship as string,
    description: (s.description as string) || '',
    completenessScore: (s.completeness_score as number) || 0,
    createdAt: (s.created_at as string) || new Date().toISOString(),
    lastConversationDate: (s.last_conversation_date as string) || 'Just created',
    voiceSampleUrl: (s.voice_sample_url as string) || undefined,
    humorStyle: s.humor_style as { style: string; confidence: number },
    adviceTone: s.advice_tone as { tone: string; confidence: number },
    activeTopics: (s.active_topics as string[]) || [],
    relationshipTone: (s.relationship_tone as string) || '',
    signaturePhrases: (s.signature_phrases as PersonalityVault['signaturePhrases']) || [],
    topicOpinions: (s.topic_opinions as PersonalityVault['topicOpinions']) || [],
    recentConversations: [],
  };
}

export async function onboardVault(
  data: {
    name: string;
    relationship: string;
    description: string;
    promptResponses: Record<number, string>;
    audioFile?: File;
  }
): Promise<PersonalityVault> {
  const form = new FormData();
  form.append('name', data.name);
  form.append('relationship', data.relationship);
  form.append('description', data.description);
  const stringified: Record<string, string> = {};
  for (const [k, v] of Object.entries(data.promptResponses)) {
    stringified[k] = v;
  }
  form.append('prompt_responses', JSON.stringify(stringified));
  if (data.audioFile) form.append('audio_file', data.audioFile);

  const res = await fetch(`${BACKEND}/api/vault/onboard`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Onboard failed');
  const json = await res.json();
  return schemaToVault(json);
}

export async function fetchVault(vaultId: string): Promise<PersonalityVault> {
  const res = await fetch(`${BACKEND}/api/vault/${vaultId}`);
  if (!res.ok) throw new Error('Vault not found');
  return schemaToVault(await res.json());
}

export async function fetchVaultsList(): Promise<PersonalityVault[]> {
  const res = await fetch(`${BACKEND}/api/vaults`);
  if (!res.ok) return [];
  const list = await res.json();
  return list.map(schemaToVault);
}

export async function sendChatMessage(
  vaultId: string,
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<ConversationResult> {
  const res = await fetch(`${BACKEND}/api/converse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vault_id: vaultId, message, conversation_history: history }),
  });
  if (!res.ok) throw new Error('Converse failed');
  const d = await res.json();
  return {
    text: d.text,
    audioUrl: d.audio_url || undefined,
    latencyMs: d.latency_ms,
    humilityTriggered: d.humility_triggered,
    schemaConfidence: d.schema_confidence,
    modelUsed: d.model_used,
  };
}

export async function fetchEvaluationResults(): Promise<EvaluationResults> {
  const res = await fetch(`${BACKEND}/api/evaluation/results`);
  if (!res.ok) throw new Error('Evaluation fetch failed');
  return res.json();
}
