import { describe, it, expect, vi } from 'vitest';

// Mock @huggingface/inference
vi.mock('@huggingface/inference', () => ({
  HfInference: vi.fn().mockImplementation(function () {
    return {
      textToImage: vi.fn().mockResolvedValue(new Blob(['fake-image'], { type: 'image/png' })),
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
  return await import('@/app/api/hf/image/route');
}

describe('POST /api/hf/image', () => {
  it('returns 401 without token', async () => {
    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/image', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'a cat' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('HuggingFace token required');
  });

  it('returns image data with valid token', async () => {
    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/image', {
      method: 'POST',
      headers: { 'x-hf-token': 'hf_valid' },
      body: JSON.stringify({
        prompt: 'a cat',
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        width: 512,
        height: 512,
      }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('returns 500 when HF SDK throws', async () => {
    const { HfInference } = await import('@huggingface/inference');
    (HfInference as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
      return {
        textToImage: vi.fn().mockRejectedValue(new Error('Model overloaded')),
      };
    });

    const { POST } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/image', {
      method: 'POST',
      headers: { 'x-hf-token': 'hf_valid' },
      body: JSON.stringify({ prompt: 'a cat' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Model overloaded');
  });
});
