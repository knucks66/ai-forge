import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock next/server since we're testing outside Next.js runtime
vi.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      private body: string;
      constructor(url: string, init?: RequestInit) {
        this.body = init?.body as string || '';
      }
      async json() {
        return JSON.parse(this.body);
      }
    },
    NextResponse: {
      json(data: unknown, init?: ResponseInit) {
        const body = JSON.stringify(data);
        return new Response(body, {
          ...init,
          headers: { 'Content-Type': 'application/json', ...init?.headers },
        });
      },
    },
  };
});

async function importRoute() {
  return await import('@/app/api/enhance-prompt/route');
}

describe('POST /api/enhance-prompt', () => {
  it('returns enhanced prompt on success', async () => {
    server.use(
      http.post('https://text.pollinations.ai/', async () => {
        return new HttpResponse('A beautifully enhanced image of a sunset over mountains', {
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );

    const { POST } = await importRoute();
    const req = new (await import('next/server')).NextRequest('http://localhost/api/enhance-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'sunset', type: 'image' }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(data.enhanced).toBeTruthy();
    expect(typeof data.enhanced).toBe('string');
  });

  it('returns error on API failure', async () => {
    server.use(
      http.post('https://text.pollinations.ai/', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { POST } = await importRoute();
    const req = new (await import('next/server')).NextRequest('http://localhost/api/enhance-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'sunset', type: 'image' }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it('uses different system prompt for non-image type', async () => {
    let capturedBody: Record<string, unknown> = {};
    server.use(
      http.post('https://text.pollinations.ai/', async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return new HttpResponse('Enhanced text prompt', {
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );

    const { POST } = await importRoute();
    const req = new (await import('next/server')).NextRequest('http://localhost/api/enhance-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'hello', type: 'text' }),
    });

    await POST(req);
    const messages = capturedBody.messages as Array<{ role: string; content: string }>;
    // For non-image type, system prompt should NOT contain 'image'
    expect(messages[0].content).not.toContain('image prompt enhancer');
  });
});
