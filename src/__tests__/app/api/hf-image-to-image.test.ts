import { describe, it, expect, vi } from 'vitest';

// Mock @huggingface/inference
vi.mock('@huggingface/inference', () => ({
  HfInference: vi.fn().mockImplementation(function () {
    return {
      imageToImage: vi.fn().mockResolvedValue(new Blob(['fake-result'], { type: 'image/png' })),
    };
  }),
}));

// Mock next/server with FormData support
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
      private _formData: FormData | null;
      headers: Map<string, string>;
      constructor(url: string, init?: RequestInit) {
        this._formData = init?.body instanceof FormData ? init.body : null;
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
      async formData() {
        return this._formData || new FormData();
      }
    },
    NextResponse: MockNextResponse,
  };
});

async function importRoute() {
  return await import('@/app/api/hf/image-to-image/route');
}

function createRequest(formFields: Record<string, string | Blob>, token?: string) {
  const { NextRequest } = require('next/server');
  const formData = new FormData();
  for (const [key, value] of Object.entries(formFields)) {
    formData.append(key, value);
  }
  const headers: Record<string, string> = {};
  if (token) headers['x-hf-token'] = token;
  return new NextRequest('http://localhost/api/hf/image-to-image', {
    method: 'POST',
    body: formData,
    headers,
  });
}

describe('POST /api/hf/image-to-image', () => {
  it('returns 401 when no token provided', async () => {
    const { POST } = await importRoute();
    const req = createRequest({
      prompt: 'test',
      image: new Blob(['img'], { type: 'image/png' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('HuggingFace token required');
  });

  it('returns 400 when no image provided', async () => {
    const { POST } = await importRoute();
    const req = createRequest({ prompt: 'test' }, 'hf_token123');

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Image file required');
  });

  it('returns 400 when no prompt provided', async () => {
    const { POST } = await importRoute();
    const req = createRequest(
      { image: new Blob(['img'], { type: 'image/png' }) },
      'hf_token123'
    );

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Prompt required');
  });

  it('returns image/png on success', async () => {
    const { POST } = await importRoute();
    const req = createRequest(
      {
        prompt: 'make it red',
        image: new Blob(['img'], { type: 'image/png' }),
      },
      'hf_token123'
    );

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('returns 500 when HF SDK throws', async () => {
    const { HfInference } = await import('@huggingface/inference');
    (HfInference as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
      return {
        imageToImage: vi.fn().mockRejectedValue(new Error('Model not found')),
      };
    });

    const { POST } = await importRoute();
    const req = createRequest(
      {
        prompt: 'test',
        image: new Blob(['img'], { type: 'image/png' }),
      },
      'hf_token123'
    );

    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Model not found');
  });
});
