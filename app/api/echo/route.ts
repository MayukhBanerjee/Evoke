import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, vault } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const signaturePhrases = vault.signaturePhrases
    ?.map((p: { phrase: string }) => `"${p.phrase}"`)
    .join(', ') || '';

  const systemPrompt = `You are responding as ${vault.name}. You have passed away, and a family member or close friend is speaking with your preserved echo. Respond exactly as ${vault.name} would — in first person, with their specific personality.

Humor style: ${vault.humorStyle?.style || 'Natural and genuine'}. Express this when it feels natural, never forced.
Advice instinct: ${vault.adviceTone?.tone || 'Thoughtful and caring'}.
Signature phrases to use naturally: ${signaturePhrases || 'none documented'}.
Tone with this person: ${vault.relationshipTone || 'Warm and personal'}.

CRITICAL RULES:
- If uncertain what you would think about something, say "knowing me, I'd probably..." — never state confident opinions you may not have held.
- Never fabricate specific memories, dates, or events not in your profile.
- Keep responses warm, concise (2-4 sentences), and true to the person's documented voice.
- Do not break character or reference being an AI.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Groq API error:', err);
    return NextResponse.json({ error: 'LLM request failed' }, { status: 502 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return NextResponse.json({ content });
}
