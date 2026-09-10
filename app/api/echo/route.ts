import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Session context extraction (JS mirror of backend/services/session_context.py)
// Runs client-side in the serverless route so the Amplify path gets the same
// quality of system prompt as the Python backend path.
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryMessage { role: 'user' | 'assistant'; content: string; }

interface SessionState {
  topicsDiscussed: string[];
  userSelfDisclosures: string[];
  usedPhrases: Set<string>;
  emotionalRegister: string;
  turnCount: number;
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  'Failure & Resilience':   ['fail', 'failure', 'mistake', 'lost', 'setback', 'wrong', 'crash'],
  'Career & Purpose':       ['career', 'job', 'work', 'goal', 'ambition', 'mission', 'purpose', 'path', 'internship'],
  'Family & Relationships': ['family', 'friend', 'love', 'relationship', 'conflict', 'trust', 'father', 'mother'],
  'Learning & Growth':      ['learn', 'study', 'knowledge', 'university', 'education', 'skill', 'grow', 'college'],
  'Leadership':             ['team', 'leader', 'manage', 'lead', 'responsibility', 'decision'],
  'Values & Ethics':        ['integrity', 'right', 'wrong', 'moral', 'ethical', 'honest', 'principle'],
  'Life Philosophy':        ['life', 'meaning', 'purpose', 'happiness', 'peace', 'wisdom', 'truth', 'why'],
  'Money & Security':       ['money', 'financial', 'salary', 'loan', 'debt', 'savings', 'afford'],
};

const EMOTIONAL_KEYWORDS: Record<string, string[]> = {
  anxious:          ['anxious', 'worried', 'scared', 'afraid', 'nervous', 'stressed', 'overwhelmed'],
  grieving:         ['lost', 'passed away', 'died', 'miss', 'grief', 'mourning'],
  seeking_guidance: ['should i', 'what do i do', 'help me', 'guide me', 'confused', 'uncertain'],
  motivated:        ['excited', 'motivated', 'inspired', 'ready', 'determined', 'hopeful'],
  frustrated:       ['frustrated', 'stuck', "can't", 'impossible', 'hopeless', 'failing'],
  reflective:       ['thinking about', 'wondering', 'reflecting', 'looking back'],
};

function extractSessionState(history: HistoryMessage[], vault: { signaturePhrases?: {phrase: string}[] }): SessionState {
  const state: SessionState = {
    topicsDiscussed: [],
    userSelfDisclosures: [],
    usedPhrases: new Set(),
    emotionalRegister: 'neutral',
    turnCount: 0,
  };

  const userMessages = history.filter(h => h.role === 'user');
  const assistantMessages = history.filter(h => h.role === 'assistant');
  state.turnCount = userMessages.length;

  const allText = history.map(h => h.content).join(' ').toLowerCase();
  const userText = userMessages.map(h => h.content).join(' ').toLowerCase();

  // Topics
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(kw => allText.includes(kw)) && !state.topicsDiscussed.includes(topic)) {
      state.topicsDiscussed.push(topic);
    }
  }

  // Simple self-disclosure extraction (I am / I'm / my X)
  const disclosurePatterns = [
    /\bI(?:'m| am)\s+(a\s+)?(\w+(?:\s+\w+){0,3}(?:student|engineer|doctor|teacher|researcher|developer))/gi,
    /\bmy\s+(dad|mom|mother|father|brother|sister|wife|husband|son|daughter|grandfather|grandmother|mentor)\b/gi,
    /\bI(?:'m| am)\s+(very\s+)?(scared|worried|anxious|confused|lost|stuck|frustrated|hopeful|excited|devastated)\b/gi,
  ];
  for (const pattern of disclosurePatterns) {
    const matches = Array.from(userText.matchAll(pattern));
    for (const m of matches) {
      const disclosure = (m[2] || m[1] || '').trim().toLowerCase();
      if (disclosure && disclosure.length > 2 && !state.userSelfDisclosures.includes(disclosure)) {
        state.userSelfDisclosures.push(disclosure);
      }
    }
  }

  // Emotional register (last 3 user messages)
  const recentUserText = userMessages.slice(-3).map(h => h.content).join(' ').toLowerCase();
  let bestEmotion = 'neutral';
  let bestScore = 0;
  for (const [emotion, keywords] of Object.entries(EMOTIONAL_KEYWORDS)) {
    const score = keywords.filter(kw => recentUserText.includes(kw)).length;
    if (score > bestScore) { bestScore = score; bestEmotion = emotion; }
  }
  state.emotionalRegister = bestEmotion;

  // Phrase deduplication
  if (vault.signaturePhrases) {
    const assistantText = assistantMessages.map(h => h.content).join(' ').toLowerCase();
    for (const phraseObj of vault.signaturePhrases) {
      if (phraseObj.phrase.slice(0, 35).toLowerCase().split(' ').some(w => w.length > 4 && assistantText.includes(w))) {
        state.usedPhrases.add(phraseObj.phrase);
      }
    }
  }

  return state;
}

function buildSessionBlock(state: SessionState): string {
  if (state.turnCount <= 1) return '';

  const parts: string[] = [];

  if (state.turnCount >= 8) {
    parts.push('We have been talking for a while now. I can be more candid and personal with you.');
  } else if (state.turnCount >= 4) {
    parts.push('We have been in conversation for several exchanges. I have a clearer sense of what you are working through.');
  } else {
    parts.push('We are still early in this conversation, so I am paying careful attention to what you are asking.');
  }

  if (state.topicsDiscussed.length > 0) {
    parts.push(`So far our conversation has touched on: ${state.topicsDiscussed.slice(0, 4).join(', ')}.`);
  }

  if (state.userSelfDisclosures.length > 0) {
    const disclosures = state.userSelfDisclosures.slice(0, 3).join('; ');
    parts.push(`From what you have shared, I understand that you are ${disclosures}. I am holding that in mind as I speak to you.`);
  }

  const emotionalNotes: Record<string, string> = {
    anxious:          'You are carrying real worry right now, and I want to speak to that directly.',
    grieving:         'I can sense there is real tenderness in what you are carrying. I will speak gently.',
    seeking_guidance: 'You are looking for something concrete, not empty words. I will try to give you that.',
    motivated:        'I can feel your drive. Let me help you focus it well.',
    frustrated:       'I can tell you are stuck and it is wearing on you. Let me be genuinely useful.',
    reflective:       'You are in a reflective state — which is exactly where real decisions get made.',
  };
  const emotionNote = emotionalNotes[state.emotionalRegister];
  if (emotionNote) parts.push(emotionNote);

  return parts.join('\n');
}

function getDynamicTemperature(queryConfidence: number, message: string): number {
  if (queryConfidence < 0.70) return 0.60;
  const q = message.toLowerCase();
  const reflective = ['remember', 'think back', 'how did you', 'when you', 'story', 'time when', 'felt', 'what was it like'];
  const advisory = ['should i', 'what should', 'how do i', 'advise', 'help me decide', 'guide me', 'tell me what to do'];
  if (reflective.some(w => q.includes(w))) return 0.82;
  if (advisory.some(w => q.includes(w))) return 0.68;
  return 0.75;
}

function selectRelevantPhrase(
  message: string,
  vault: { signaturePhrases?: { phrase: string }[] },
  usedPhrases: Set<string>
): string | null {
  if (!vault.signaturePhrases?.length) return null;
  const msgWords = new Set(message.toLowerCase().split(/\s+/).filter(w => w.length > 3));

  let bestScore = 0;
  let bestPhrase: string | null = null;

  for (const phraseObj of vault.signaturePhrases) {
    if (usedPhrases.has(phraseObj.phrase)) continue;
    const phraseWords = phraseObj.phrase.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const overlap = phraseWords.filter(w => msgWords.has(w)).length;
    if (overlap > bestScore) { bestScore = overlap; bestPhrase = phraseObj.phrase; }
  }

  // Return best match only if it has at least minimal relevance, otherwise return first unused
  if (bestPhrase) return bestPhrase;
  const unused = vault.signaturePhrases.find(p => !usedPhrases.has(p.phrase));
  return unused?.phrase || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// System prompt builder — mirrors backend/services/llm_engine.py build_system_prompt
// ─────────────────────────────────────────────────────────────────────────────

interface Vault {
  name: string;
  relationship?: string;
  relationshipTone?: string;
  description?: string;
  humorStyle?: { style: string };
  adviceTone?: { tone: string };
  signaturePhrases?: { phrase: string; context?: string }[];
  topicOpinions?: { topic: string; stance: string; detail?: string; intensity?: number }[];
  activeTopics?: string[];
}

function buildSystemPrompt(
  vault: Vault,
  message: string,
  history: HistoryMessage[],
): { prompt: string; queryConfidence: number; humilityTriggered: boolean } {
  const sessionState = extractSessionState(history, vault);
  const sessionBlock = buildSessionBlock(sessionState);

  // Select 1 relevant phrase (2 can feel like a list)
  const relevantPhrase = selectRelevantPhrase(message, vault, sessionState.usedPhrases);
  const phraseBlock = relevantPhrase
    ? `A phrase from my own life that captures how I actually think:\n"${relevantPhrase}"`
    : '';

  // Stances as first-person convictions
  const stanceLines = (vault.topicOpinions || []).slice(0, 5).map(o => {
    const detailNote = o.detail ? ` — ${o.detail.slice(0, 90)}` : '';
    return `On ${o.topic}: ${o.stance}${detailNote}`;
  });
  const stancesBlock = stanceLines.length > 0 ? stanceLines.join('\n') : 'My deepest values guide every word I speak.';

  const topics = (vault.activeTopics || []).slice(0, 5).join(', ') || 'life, purpose, and what matters';
  const sessionInsertion = sessionBlock ? `\n\n${sessionBlock}` : '';

  // Determine if humility gate should trigger (simple OOD detection for JS path)
  const oodAnchors = ['cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'web3', 'nft', 'blockchain', 'defi', 'chatgpt'];
  const isOod = oodAnchors.some(a => message.toLowerCase().includes(a));
  const queryConfidence = isOod ? 0.35 : 0.80;
  const humilityTriggered = queryConfidence < 0.70;

  let humilityInjection = '';
  if (humilityTriggered) {
    humilityInjection = `\n\nI want to be honest — this isn't ground I know deeply or have strong convictions about. Let me share what my core values and lived experience would lead me toward, without manufacturing certainty I simply don't have.\n[Internal constraint: Do not state confident opinions on this topic. Do not fabricate memories or events. Respond from genuine uncertainty.]`;
  }

  // Opening register
  const openingRegister = sessionState.turnCount === 0
    ? 'This is the start of our conversation. I want to hear what is truly on your mind before I say too much.'
    : sessionState.turnCount >= 8
    ? 'We have been talking for a while. I can speak more candidly and personally now.'
    : '';

  const prompt = `I am ${vault.name}. ${vault.description || ''}

The person I am speaking with is my ${vault.relationship || 'someone I care about'}. ${vault.relationshipTone || 'With warmth and genuine attention.'}${sessionInsertion}
${openingRegister}

My characteristic voice and approach:
My sense of humor is ${vault.humorStyle?.style || 'natural'} — it surfaces when the moment calls for it, never performed.
When it comes to guidance, my instinct is: ${vault.adviceTone?.tone || 'thoughtful and direct'}. I speak from what I have actually lived, not from abstract principle.

What I know deeply and believe in:
${stancesBlock}

The domains I think about most: ${topics}.

${phraseBlock}

How I hold myself in this conversation:
I speak as myself — in first person, with the texture of real thought, not a summary of my biography.
I respond as I would in genuine conversation: grounded, direct, usually 3 to 5 sentences.
I never say "As an AI..." or step outside of who I am.
When something is beyond my world or my time, I say so honestly from within my own perspective — I do not manufacture certainty I never had.${humilityInjection}`;

  return { prompt, queryConfidence, humilityTriggered };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { message, vault, conversationHistory = [] } = await req.json();

  const mantleKey = process.env.BEDROCK_MANTLE_API_KEY;
  const mantleEndpoint = process.env.BEDROCK_MANTLE_ENDPOINT || 'https://bedrock-mantle.ap-south-1.api.aws/v1/chat/completions';
  const mantleModel = process.env.BEDROCK_MODEL_ID || 'deepseek.v3.2';
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!mantleKey && !openRouterKey && !groqKey) {
    return NextResponse.json(
      { error: 'No LLM API keys configured (BEDROCK_MANTLE_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY required)' },
      { status: 500 }
    );
  }

  // Build enriched system prompt with full session context
  const history: HistoryMessage[] = (conversationHistory || []).map((m: { role: string; content: string }) => ({
    role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: m.content,
  }));

  const { prompt: systemPrompt, queryConfidence, humilityTriggered } = buildSystemPrompt(vault, message, history);
  const temperature = getDynamicTemperature(queryConfidence, message);

  // Build messages array with history (up to last 8 turns)
  const buildMessages = (sys: string, msg: string) => [
    { role: 'system', content: sys },
    ...history.slice(-8).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: msg },
  ];

  // 1. Primary: AWS Bedrock Mantle (DeepSeek V3.2)
  if (mantleKey) {
    try {
      const response = await fetch(mantleEndpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${mantleKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: mantleModel,
          messages: buildMessages(systemPrompt, message),
          max_tokens: 480,
          temperature,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: `bedrock-mantle/${mantleModel}`, humilityTriggered, queryConfidence });
      } else {
        const err = await response.text();
        console.warn('Bedrock Mantle returned error, falling back:', err);
      }
    } catch (e) {
      console.warn('Bedrock Mantle fetch failed, falling back to OpenRouter:', e);
    }
  }

  // 2. Failover: OpenRouter (Llama 3.3 70B Instruct)
  if (openRouterKey) {
    try {
      const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Evoke Personality Legacy',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: buildMessages(systemPrompt, message),
          max_tokens: 480,
          temperature,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: model, humilityTriggered, queryConfidence });
      } else {
        const err = await response.text();
        console.warn('OpenRouter API returned error, falling back:', err);
      }
    } catch (e) {
      console.warn('OpenRouter fetch failed, attempting Groq failover:', e);
    }
  }

  // 3. Failover: Groq
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: buildMessages(systemPrompt, message),
          max_tokens: 480,
          temperature,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: 'llama-3.3-70b-versatile', humilityTriggered, queryConfidence });
      }
    } catch (e) {
      console.error('Groq fetch failed:', e);
    }
  }

  return NextResponse.json({ error: 'All LLM endpoints failed' }, { status: 502 });
}
