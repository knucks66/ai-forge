import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();
    const apiKey = req.headers.get('x-openrouter-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key required' }, { status: 401 });
    }

    const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ai-forge.app',
        'X-Title': 'AI Forge',
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.5-flash-image-preview:free',
        messages: [{ role: 'user', content: `Generate an image: ${prompt}` }],
        modalities: ['image', 'text'],
      }),
    });

    if (!orResponse.ok) {
      const errorData = await orResponse.json().catch(() => ({ error: { message: 'OpenRouter API error' } }));
      return NextResponse.json(
        { error: errorData.error?.message || 'OpenRouter image generation failed' },
        { status: orResponse.status }
      );
    }

    const data = await orResponse.json();
    const parts = data.choices?.[0]?.message?.content;

    // Content can be a string or an array of parts
    let imageData: string | null = null;
    let mimeType = 'image/png';

    if (Array.isArray(parts)) {
      for (const part of parts) {
        if (part.type === 'image_url' && part.image_url?.url) {
          const dataUrl = part.image_url.url as string;
          const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            imageData = match[2];
          }
        }
      }
    }

    if (!imageData) {
      return NextResponse.json({ error: 'No image generated. Try a different prompt.' }, { status: 500 });
    }

    const buffer = Buffer.from(imageData, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image generation failed';
    const status = (error as { status?: number })?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
