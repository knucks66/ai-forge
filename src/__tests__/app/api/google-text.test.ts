import { describe, it, expect, vi } from 'vitest';

// Mock @google/genai
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(function () {
    return {
      models: {
        generateContentStream: vi.fn().mockImplementation(async function* () {
          yield { text: 'Hello' };
          yield { text: ' world' };
        }),
      },
    };
  }),
}));

async function importRoute() {
  return await import('@/app/api/google/text/route');
}

function makeRequest(body: object, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as any;
}

describe('POST /api/google/text', () => {
  it('returns 401 without API key', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Google API key required');
  });

  it('streams text content with valid API key', async () => {
    const { POST } = await importRoute();
    const req = makeRequest(
      {
        messages: [{ role: 'user', content: 'Hi' }],
        model: 'gemini-2.5-flash',
      },
      { 'x-google-api-key': 'AIzaSyValid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const text = await res.text();
    expect(text).toContain('data: {"content":"Hello"}');
    expect(text).toContain('data: {"content":" world"}');
    expect(text).toContain('data: [DONE]');
  });

  it('returns 500 when SDK throws', async () => {
    const { GoogleGenAI } = await import('@google/genai');
    (GoogleGenAI as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
      return {
        models: {
          generateContentStream: vi.fn().mockRejectedValue(new Error('API quota exceeded')),
        },
      };
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { messages: [{ role: 'user', content: 'Hi' }] },
      { 'x-google-api-key': 'AIzaSyValid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('API quota exceeded');
  });
});
