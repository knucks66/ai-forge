import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

async function importRoute() {
  return await import('@/app/api/openrouter/image/route');
}

function makeRequest(body: object, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as any;
}

describe('POST /api/openrouter/image', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 401 without API key', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ prompt: 'a cat' });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('OpenRouter API key required');
  });

  it('returns image binary from base64 response', async () => {
    // Create a small fake PNG-like base64 string
    const fakeImageBase64 = Buffer.from('fake-image-data').toString('base64');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: [
              { type: 'text', text: 'Here is your image' },
              {
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${fakeImageBase64}` },
              },
            ],
          },
        }],
      }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { prompt: 'a cute cat', model: 'google/gemini-2.5-flash-image-preview:free' },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');

    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(0);
  });

  it('returns 500 when no image is generated', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: [
              { type: 'text', text: 'Sorry, I cannot generate an image.' },
            ],
          },
        }],
      }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { prompt: 'a cat' },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('No image generated');
  });

  it('passes through error status from OpenRouter API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: async () => ({ error: { message: 'Insufficient credits' } }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { prompt: 'a cat' },
      { 'x-openrouter-api-key': 'sk-or-valid' }
    );

    const res = await POST(req);
    expect(res.status).toBe(402);
    const data = await res.json();
    expect(data.error).toBe('Insufficient credits');
  });

  it('sends modalities and required headers', async () => {
    const fakeImageBase64 = Buffer.from('img').toString('base64');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: [{
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${fakeImageBase64}` },
            }],
          },
        }],
      }),
    });

    const { POST } = await importRoute();
    const req = makeRequest(
      { prompt: 'a cat' },
      { 'x-openrouter-api-key': 'sk-or-test' }
    );

    await POST(req);

    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toBe('https://openrouter.ai/api/v1/chat/completions');
    const body = JSON.parse(fetchCall[1].body);
    expect(body.modalities).toEqual(['image', 'text']);
    expect(fetchCall[1].headers['X-Title']).toBe('AI Forge');
  });
});
