import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens, topP } = await req.json();
    const apiKey = req.headers.get('x-google-api-key');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Google API key required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Separate system prompt from conversation messages
    let systemInstruction: string | undefined;
    const conversationMessages: Array<{ role: string; content: string }> = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else {
        conversationMessages.push(msg);
      }
    }

    // Convert to Gemini format: 'assistant' → 'model'
    const contents = conversationMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const stream = await ai.models.generateContentStream({
      model: model || 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: temperature || 0.7,
        maxOutputTokens: maxTokens || 2048,
        topP: topP || 0.9,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.text || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Text generation failed';
    // Preserve status code from Google API errors (e.g. 429 rate limit vs 400 invalid key)
    const status = (error as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
