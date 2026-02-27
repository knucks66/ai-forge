import { HfInference } from '@huggingface/inference';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens, topP } = await req.json();
    const token = req.headers.get('x-hf-token');

    if (!token) {
      return new Response(JSON.stringify({ error: 'HuggingFace token required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hf = new HfInference(token);
    const stream = hf.chatCompletionStream({
      model: model || 'mistralai/Mistral-7B-Instruct-v0.3',
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048,
      top_p: topP || 0.9,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
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
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
