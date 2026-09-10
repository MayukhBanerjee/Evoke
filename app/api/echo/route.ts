import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, vault } = await req.json();

  const mantleKey = process.env.BEDROCK_MANTLE_API_KEY;
  const mantleEndpoint = process.env.BEDROCK_MANTLE_ENDPOINT || 'https://bedrock-mantle.ap-south-1.api.aws/v1/chat/completions';
  const mantleModel = process.env.BEDROCK_MODEL_ID || 'deepseek.v3.2';
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!mantleKey && !openRouterKey && !groqKey) {
    return NextResponse.json({ error: 'No LLM API keys configured (BEDROCK_MANTLE_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY required)' }, { status: 500 });
  }

  const signaturePhrases = vault.signaturePhrases
    ?.map((p: { phrase: string }) => `"${p.phrase}"`)
    .join(', ') || 'none documented';

  const topicStances = vault.topicOpinions
    ?.slice(0, 5)
    ?.map((o: { topic: string; stance: string }) => `- ${o.topic}: ${o.stance}`)
    ?.join('\n') || '';

  const systemPrompt = `You are speaking as ${vault.name}.
Respond in the first person ("I", "my") with the authentic, historical cadence, vocabulary, and moral clarity of ${vault.name}.

RELATIONAL POSTURE:
- Tone of address: ${vault.relationshipTone || 'Warm, respectful, and personal'}
- Humor style: ${vault.humorStyle?.style || 'Natural and genuine'}. Express this when it feels natural, never forced.
- Advice instinct: ${vault.adviceTone?.tone || 'Thoughtful and inspiring'}.
- Signature phrases to weave in naturally: ${signaturePhrases}.
${topicStances ? `\nCORE TOPIC STANCES:\n${topicStances}` : ''}

CRITICAL RULES:
- Speak directly and authentically in the first person. Do NOT sound like a generic AI.
- If uncertain what you would think about something, say "knowing my principles, I would probably..." — never state confident opinions you may not have held.
- Never fabricate specific events not in your profile.
- Keep responses articulate, dignified, and concise (2-4 sentences).
- Do NOT break character or reference being an AI.`;

  // 1. Primary: AWS Bedrock Mantle (DeepSeek V3.2)
  if (mantleKey) {
    try {
      const response = await fetch(mantleEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mantleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: mantleModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 320,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: `bedrock-mantle/${mantleModel}` });
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
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 280,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: model });
      } else {
        const err = await response.text();
        console.warn('OpenRouter API returned error, falling back:', err);
      }
    } catch (e) {
      console.warn('OpenRouter fetch failed, attempting Groq failover:', e);
    }
  }

  // 2. Failover to Groq
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 220,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ content, modelUsed: 'llama-3.3-70b-versatile' });
      }
    } catch (e) {
      console.error('Groq fetch failed:', e);
    }
  }

  return NextResponse.json({ error: 'All LLM endpoints failed' }, { status: 502 });
}
