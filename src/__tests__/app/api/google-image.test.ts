import { describe, it, expect, vi } from 'vitest';

const fakeBase64Image = Buffer.from('fake-image-data').toString('base64');

// Mock @google/genai
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(function () {
    return {
      models: {
        generateContent: vi.fn().mockResolvedValue({
          candidates: [
            {
              content: {
                parts: [
                  { text: 'Here is the image' },
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: Buffer.from('fake-image-data').toString('base64'),
                    },
                  },
                ],
              },
            },
          ],
        }),
      },
    };
  }),
}));

// Mock next/server
vi.mock('next/server', () => {
  class MockNextResponse extends Response {
    static json(data: unknown, init?: ResponseInit) {
      return new MockNextResponse(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    }
  }

  return {
    NextRequest: class MockNextRequest {
      private body: string;
      headers: Map<string, string>;
      constructor(url: string, init?: RequestInit) {
        this.body = init?.body as string || '';
        this.headers = new Map();
        if (init?.headers) {
          const h = init.headers as Record<string, string>;
          for (const [k, v] of Object.entries(h)) {
            this.headers.set(k, v);
          }
        }
      }
      get(key: string) {
        return this.headers.get(key) || null;
      }
      async json() {
        return JSON.parse(this.body);
      }
    },
    NextResponse: MockNextResponse,
  };
});

async function importRoute() {
  return await import('@/app/api/google/image/route');
}

describe('POST /api/google/image', () => {
  it('returns 401 without API key', async () => {
    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/google/image', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'a cat' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Google API key required');
  });

  it('returns image data with valid API key', async () => {
    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/google/image', {
      method: 'POST',
      headers: { 'x-google-api-key': 'AIzaSyValid' },
      body: JSON.stringify({ prompt: 'a cat' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('returns 500 when no image is generated', async () => {
    const { GoogleGenAI } = await import('@google/genai');
    (GoogleGenAI as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
      return {
        models: {
          generateContent: vi.fn().mockResolvedValue({
            candidates: [
              {
                content: {
                  parts: [{ text: 'I cannot generate that image' }],
                },
              },
            ],
          }),
        },
      };
    });

    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/google/image', {
      method: 'POST',
      headers: { 'x-google-api-key': 'AIzaSyValid' },
      body: JSON.stringify({ prompt: 'invalid' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('No image generated. Try a different prompt.');
  });

  it('returns 500 when SDK throws', async () => {
    const { GoogleGenAI } = await import('@google/genai');
    (GoogleGenAI as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
      return {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Rate limit exceeded')),
        },
      };
    });

    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/google/image', {
      method: 'POST',
      headers: { 'x-google-api-key': 'AIzaSyValid' },
      body: JSON.stringify({ prompt: 'a cat' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Rate limit exceeded');
  });
});
