import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

async function importRoute() {
  return await import('@/app/api/openrouter/text/route');
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

describe('POST /api/openrouter/text', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 401 without API key', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('OpenRouter API key required');
  });

  it('streams text content with valid API key', async () => {
    const sseData = [
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" from OR"}}]}\n\n',
      'data: [DONE]\n\n',
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: createSSEStream(sseData),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const text = await res.text();
    expect(text).toContain('data: {"content":"Hello"}');
    expect(text).toContain('data: {"content":" from OR"}');
    expect(text).toContain('data: [DONE]');
  });

  it('filters out OPENROUTER PROCESSING comments', async () => {
    const sseData = [
      ': OPENROUTER PROCESSING\n\n',
      'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n',
      'data: [DONE]\n\n',
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: createSSEStream(sseData),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    const text = await res.text();
    expect(text).not.toContain('OPENROUTER PROCESSING');
    expect(text).toContain('data: {"content":"Hi"}');
  });

  it('sends required OpenRouter headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: createSSEStream(['data: [DONE]\n\n']),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-openrouter-api-key': 'sk-or-test' }
    );

    await POST(req);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-or-test',
          'HTTP-Referer': 'https://ai-forge.app',
          'X-Title': 'AI Forge',
        }),
      })
    );
  });

  it('passes through error status from OpenRouter API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe('Rate limit exceeded');
  });
});
