import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

async function importRoute() {
  return await import('@/app/api/groq/text/route');
}

function makeRequest(body: object, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as any;
}

function createSSEStream(chunks: string[]) {
  const encoder = new TextEncoder();
  let index = 0;
  return new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });
}

describe('POST /api/groq/text', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 401 without API key', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Groq API key required');
  });

  it('streams text content with valid API key', async () => {
    const sseData = [
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
      'data: [DONE]\n\n',
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: createSSEStream(sseData),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }], model: 'llama-3.3-70b-versatile' },
      { 'x-groq-api-key': 'gsk_valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const text = await res.text();
    expect(text).toContain('data: {"content":"Hello"}');
    expect(text).toContain('data: {"content":" world"}');
    expect(text).toContain('data: [DONE]');
  });

  it('passes through error status from Groq API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-groq-api-key': 'gsk_valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe('Rate limit exceeded');
  });

  it('sends correct headers to Groq API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: createSSEStream(['data: [DONE]\n\n']),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-groq-api-key': 'gsk_test123' }
    );

    await POST(req);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer gsk_test123',
        }),
      })
    );
  });
});
