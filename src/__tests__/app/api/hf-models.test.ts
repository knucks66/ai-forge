import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock next/server
vi.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      headers: Map<string, string>;
      nextUrl: URL;
      constructor(url: string, init?: RequestInit) {
        this.nextUrl = new URL(url);
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
    },
    NextResponse: {
      json(data: unknown, init?: ResponseInit) {
        return new Response(JSON.stringify(data), {
          ...init,
          headers: { 'Content-Type': 'application/json', ...init?.headers },
        });
      },
    },
  };
});

/** Helper to create a mock model with hf-inference provider mapping */
function mockModel(modelId: string, overrides?: Record<string, unknown>) {
  return {
    modelId,
    description: '',
    tags: [],
    inferenceProviderMapping: [
      { provider: 'hf-inference', status: 'live', task: 'text-to-image' },
    ],
    ...overrides,
  };
}

async function importRoute() {
  return await import('@/app/api/hf/models/route');
}

describe('GET /api/hf/models', () => {
  it('defaults to text-to-image task', async () => {
    let capturedUrl = '';
    server.use(
      http.get('https://huggingface.co/api/models', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([
          mockModel('org/test-model', { description: 'A model', tags: ['test'] }),
        ]);
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models');

    const res = await GET(req as any);
    const data = await res.json();

    expect(capturedUrl).toContain('pipeline_tag=text-to-image');
    expect(data[0].type).toBe('image');
  });

  it('normalizes model data', async () => {
    server.use(
      http.get('https://huggingface.co/api/models', () => {
        return HttpResponse.json([
          mockModel('org/my-model', {
            id: 'org/my-model',
            description: 'Description text here',
            tags: ['diffusers', 'stable-diffusion'],
          }),
        ]);
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models?task=text-to-image');

    const res = await GET(req as any);
    const data = await res.json();

    expect(data[0].id).toBe('org/my-model');
    expect(data[0].name).toBe('my-model');
    expect(data[0].provider).toBe('huggingface');
    expect(data[0].type).toBe('image');
  });

  it('maps text-generation task to "text" type', async () => {
    server.use(
      http.get('https://huggingface.co/api/models', () => {
        return HttpResponse.json([
          mockModel('org/text-model'),
        ]);
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models?task=text-generation');

    const res = await GET(req as any);
    const data = await res.json();
    expect(data[0].type).toBe('text');
  });

  it('maps text-to-video task to "video" type', async () => {
    server.use(
      http.get('https://huggingface.co/api/models', () => {
        return HttpResponse.json([
          mockModel('org/video-model'),
        ]);
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models?task=text-to-video');

    const res = await GET(req as any);
    const data = await res.json();
    expect(data[0].type).toBe('video');
  });

  it('filters out models without hf-inference provider', async () => {
    server.use(
      http.get('https://huggingface.co/api/models', () => {
        return HttpResponse.json([
          mockModel('org/free-model'),
          {
            modelId: 'org/paid-only-model',
            description: '',
            tags: [],
            inferenceProviderMapping: [
              { provider: 'fal-ai', status: 'live', task: 'text-to-image' },
            ],
          },
          {
            modelId: 'org/no-inference-model',
            description: '',
            tags: [],
            inferenceProviderMapping: [],
          },
        ]);
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models?task=text-to-image');

    const res = await GET(req as any);
    const data = await res.json();

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('org/free-model');
  });

  it('returns 500 on HuggingFace API error', async () => {
    server.use(
      http.get('https://huggingface.co/api/models', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    const { GET } = await importRoute();
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/hf/models');

    const res = await GET(req as any);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });
});
