import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();
    const apiKey = req.headers.get('x-google-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Google API key required' }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json({ error: 'No response from model' }, { status: 500 });
    }

    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));
    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: 'No image generated. Try a different prompt.' }, { status: 500 });
    }

    const { data, mimeType } = imagePart.inlineData;
    const buffer = Buffer.from(data!, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType || 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image generation failed';
    const status = (error as { status?: number })?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
