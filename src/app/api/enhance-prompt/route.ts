import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();

    const systemPrompt = type === 'image'
      ? 'You are an AI image prompt enhancer. Take the user\'s simple prompt and enhance it with rich details, artistic style, lighting, composition, and quality descriptors. Return ONLY the enhanced prompt, nothing else. Keep it under 200 words.'
      : 'You are a prompt enhancer. Improve the given prompt with more detail and specificity. Return ONLY the enhanced prompt.';

    const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Enhance this prompt: ${prompt}` },
        ],
        model: 'openai',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to enhance prompt');
    }

    const data = await response.json();
    const enhanced = data?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ enhanced: enhanced.trim() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Prompt enhancement failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
