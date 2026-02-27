import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

async function importHuggingface() {
  return await import('@/lib/api/huggingface');
}

describe('generateHfImage', () => {
  it('sends request to /api/hf/image with token header', async () => {
    const { generateHfImage } = await importHuggingface();
    let capturedToken = '';
    server.use(
      http.post('/api/hf/image', ({ request }) => {
        capturedToken = request.headers.get('x-hf-token') || '';
        return new HttpResponse(new TextEncoder().encode('fake-img').buffer, {
          headers: { 'Content-Type': 'image/png' },
        });
      })
    );

    await generateHfImage('a cat', 'hf_token123');
    expect(capturedToken).toBe('hf_token123');
  });

  it('sends correct body with defaults', async () => {
    const { generateHfImage } = await importHuggingface();
    let body: Record<string, unknown> = {};
    server.use(
      http.post('/api/hf/image', async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return new HttpResponse(new TextEncoder().encode('fake-img').buffer, {
          headers: { 'Content-Type': 'image/png' },
        });
      })
    );

    await generateHfImage('test', 'token');
    expect(body.prompt).toBe('test');
    expect(body.width).toBe(512);
    expect(body.height).toBe(512);
    expect(body.guidanceScale).toBe(7);
    expect(body.numInferenceSteps).toBe(30);
  });

  it('returns url and blob on success', async () => {
    const { generateHfImage } = await importHuggingface();
    const result = await generateHfImage('test', 'token');
    expect(result.url).toMatch(/^blob:/);
    expect(result.blob).toBeDefined();
    expect(result.blob.size).toBeGreaterThan(0);
  });

  it('throws on 401 (no token)', async () => {
    const { generateHfImage } = await importHuggingface();
    server.use(
      http.post('/api/hf/image', () => {
        return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
      })
    );

    await expect(generateHfImage('test', '')).rejects.toThrow('HuggingFace token required');
  });

  it('throws generic message when error parsing fails', async () => {
    const { generateHfImage } = await importHuggingface();
    server.use(
      http.post('/api/hf/image', () => {
        return new HttpResponse('not json', { status: 500 });
      })
    );

    await expect(generateHfImage('test', 'token')).rejects.toThrow('Image generation failed');
  });
});

describe('generateHfText', () => {
  it('sends request to /api/hf/text', async () => {
    const { generateHfText } = await importHuggingface();
    const response = await generateHfText(
      [{ role: 'user', content: 'Hi' }],
      'token123'
    );
    expect(response).toBeInstanceOf(Response);
  });

  it('throws on error response', async () => {
    const { generateHfText } = await importHuggingface();
    server.use(
      http.post('/api/hf/text', () => {
        return HttpResponse.json({ error: 'Token required' }, { status: 401 });
      })
    );

    await expect(generateHfText([{ role: 'user', content: 'Hi' }], '')).rejects.toThrow('Token required');
  });
});

describe('generateHfVideo', () => {
  it('returns url and blob on success', async () => {
    const { generateHfVideo } = await importHuggingface();
    const result = await generateHfVideo('sunset', 'token');
    expect(result.url).toMatch(/^blob:/);
    expect(result.blob).toBeDefined();
    expect(result.blob.size).toBeGreaterThan(0);
  });

  it('throws on error', async () => {
    const { generateHfVideo } = await importHuggingface();
    server.use(
      http.post('/api/hf/video', () => {
        return HttpResponse.json({ error: 'Video failed' }, { status: 500 });
      })
    );

    await expect(generateHfVideo('test', 'token')).rejects.toThrow('Video failed');
  });
});

describe('fetchHfModels', () => {
  it('returns normalized model array', async () => {
    const { fetchHfModels } = await importHuggingface();
    const models = await fetchHfModels('text-to-image');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models[0]).toHaveProperty('id');
    expect(models[0]).toHaveProperty('provider');
  });

  it('passes token header when provided', async () => {
    const { fetchHfModels } = await importHuggingface();
    let capturedToken = '';
    server.use(
      http.get('/api/hf/models', ({ request }) => {
        capturedToken = request.headers.get('x-hf-token') || '';
        return HttpResponse.json([]);
      })
    );

    await fetchHfModels('text-to-image', 'hf_abc');
    expect(capturedToken).toBe('hf_abc');
  });

  it('returns empty array on failure', async () => {
    const { fetchHfModels } = await importHuggingface();
    server.use(
      http.get('/api/hf/models', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const models = await fetchHfModels('text-to-image');
    expect(models).toEqual([]);
  });
});
