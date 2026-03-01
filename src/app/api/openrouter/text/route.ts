import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens, topP } = await req.json();
    const apiKey = req.headers.get('x-openrouter-api-key');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
        model: model || 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 2048,
        top_p: topP || 0.9,
        stream: true,
      }),
    });

    if (!orResponse.ok) {
      const errorData = await orResponse.json().catch(() => ({ error: { message: 'OpenRouter API error' } }));
      return new Response(JSON.stringify({ error: errorData.error?.message || 'OpenRouter API error' }), {
        status: orResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reader = orResponse.body?.getReader();
    if (!reader) {
      return new Response(JSON.stringify({ error: 'No response stream' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              // Filter out OpenRouter keep-alive comments
              if (!trimmed || trimmed.startsWith(': OPENROUTER PROCESSING') || !trimmed.startsWith('data: ')) continue;
              const data = trimmed.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                // Skip unparseable chunks
              }
            }
          }
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
