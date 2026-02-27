import { describe, it, expect, beforeAll, afterAll, afterEach, vi, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useSettingsStore } from '@/stores/useSettingsStore';

// Create a dedicated server for this test file with a handler that captures requests
let capturedRequests: { url: string; headers: Record<string, string> }[] = [];

const testServer = setupServer(
  // Catch ALL requests to image.pollinations.ai
  http.get('https://image.pollinations.ai/prompt/:encodedPrompt', ({ request }) => {
    capturedRequests.push({
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    });
    const buffer = new TextEncoder().encode('fake-image-data').buffer;
    return new HttpResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  }),

  // Pollinations text
  http.post('https://text.pollinations.ai/', async ({ request }) => {
    const body = await request.json();
    capturedRequests.push({
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    });
    return HttpResponse.json('response text');
  }),

  // Pollinations models - returns array of objects
  http.get('https://image.pollinations.ai/models', () => {
    return HttpResponse.json([
      { id: 'flux', name: 'FLUX.1' },
      { id: 'turbo', name: 'Turbo' },
    ]);
  }),
  http.get('https://text.pollinations.ai/models', () => {
    return HttpResponse.json(['openai', 'mistral']);
  }),
);

beforeAll(() => testServer.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  testServer.resetHandlers();
  capturedRequests = [];
});
afterAll(() => testServer.close());

beforeEach(() => {
  useSettingsStore.setState({ hfToken: '', pollinationsKey: '' });
  capturedRequests = [];
});

async function importPollinations() {
  return await import('@/lib/api/pollinations');
}

describe('generatePollinationsImage', () => {
  it('constructs correct URL with encoded prompt', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('a cute cat');
    expect(capturedRequests[0].url).toContain('/prompt/a%20cute%20cat');
  });

  it('includes model and dimensions in query params', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('test', { model: 'flux', width: 1024, height: 768 });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('model')).toBe('flux');
    expect(url.searchParams.get('width')).toBe('1024');
    expect(url.searchParams.get('height')).toBe('768');
  });

  it('includes seed when >= 0', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('test', { seed: 42 });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('seed')).toBe('42');
  });

  it('does not include seed when < 0', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('test', { seed: -1 });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.has('seed')).toBe(false);
  });

  it('includes image param when provided', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('edit this', { image: 'data:image/png;base64,abc123' });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('image')).toBe('data:image/png;base64,abc123');
  });

  it('includes negative_prompt param when provided', async () => {
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('test', { negative_prompt: 'ugly, blurry' });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('negative_prompt')).toBe('ugly, blurry');
  });

  it('includes Authorization header when pollinationsKey is set', async () => {
    useSettingsStore.setState({ pollinationsKey: 'pk_test123' });
    const { generatePollinationsImage } = await importPollinations();
    await generatePollinationsImage('test');
    expect(capturedRequests[0].headers['authorization']).toBe('Bearer pk_test123');
  });

  it('returns url and blob on success', async () => {
    const { generatePollinationsImage } = await importPollinations();
    const result = await generatePollinationsImage('test');
    expect(result.url).toMatch(/^blob:/);
    expect(result.blob).toBeDefined();
    expect(result.blob.size).toBeGreaterThan(0);
  });

  it('throws on non-ok response', async () => {
    const { generatePollinationsImage } = await importPollinations();
    testServer.use(
      http.get('https://image.pollinations.ai/prompt/:encodedPrompt', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    await expect(generatePollinationsImage('test')).rejects.toThrow('Pollinations image generation failed');
  });
});

describe('generatePollinationsVideo', () => {
  it('constructs correct URL with video params', async () => {
    const { generatePollinationsVideo } = await importPollinations();
    await generatePollinationsVideo('a sunset', {
      model: 'wan',
      duration: 5,
      aspectRatio: '16:9',
      audio: true,
    });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('model')).toBe('wan');
    expect(url.searchParams.get('duration')).toBe('5');
    expect(url.searchParams.get('aspect_ratio')).toBe('16:9');
    expect(url.searchParams.get('audio')).toBe('true');
    expect(url.searchParams.get('nologo')).toBe('true');
  });

  it('includes image param for i2v', async () => {
    const { generatePollinationsVideo } = await importPollinations();
    await generatePollinationsVideo('animate', { model: 'wan', image: 'data:image/png;base64,abc' });
    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get('image')).toBe('data:image/png;base64,abc');
  });

  it('returns url and blob on success', async () => {
    const { generatePollinationsVideo } = await importPollinations();
    const result = await generatePollinationsVideo('test', { model: 'wan' });
    expect(result.url).toMatch(/^blob:/);
    expect(result.blob).toBeDefined();
  });

  it('throws on non-ok response', async () => {
    const { generatePollinationsVideo } = await importPollinations();
    testServer.use(
      http.get('https://image.pollinations.ai/prompt/:encodedPrompt', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
      })
    );

    await expect(generatePollinationsVideo('test')).rejects.toThrow('Pollinations video generation failed');
  });
});

describe('generatePollinationsText', () => {
  it('sends correct request body', async () => {
    const { generatePollinationsText } = await importPollinations();
    let requestBody: Record<string, unknown> = {};
    testServer.use(
      http.post('https://text.pollinations.ai/', async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json('response');
      })
    );

    await generatePollinationsText(
      [{ role: 'user', content: 'Hello' }],
      { model: 'mistral', temperature: 0.5, stream: false }
    );

    expect(requestBody.model).toBe('mistral');
    expect(requestBody.temperature).toBe(0.5);
    expect(requestBody.stream).toBe(false);
    expect(requestBody.messages).toHaveLength(1);
  });

  it('uses defaults when options not provided', async () => {
    const { generatePollinationsText } = await importPollinations();
    let requestBody: Record<string, unknown> = {};
    testServer.use(
      http.post('https://text.pollinations.ai/', async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json('response');
      })
    );

    await generatePollinationsText([{ role: 'user', content: 'Hi' }]);

    expect(requestBody.model).toBe('openai');
    expect(requestBody.temperature).toBe(0.7);
    expect(requestBody.max_tokens).toBe(2048);
    expect(requestBody.top_p).toBe(0.9);
    expect(requestBody.stream).toBe(true);
  });

  it('throws on non-ok response', async () => {
    const { generatePollinationsText } = await importPollinations();
    testServer.use(
      http.post('https://text.pollinations.ai/', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
      })
    );

    await expect(generatePollinationsText([{ role: 'user', content: 'Hi' }])).rejects.toThrow(
      'Pollinations text generation failed'
    );
  });
});

describe('fetchPollinationsModels', () => {
  it('returns an array of PollinationsModelInfo objects', async () => {
    const { fetchPollinationsModels } = await importPollinations();
    const models = await fetchPollinationsModels('image');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(2);
    expect(models[0]).toHaveProperty('id');
    expect(models[0]).toHaveProperty('name');
  });

  it('handles array-of-strings response', async () => {
    testServer.use(
      http.get('https://image.pollinations.ai/models', () => {
        return HttpResponse.json(['flux', 'turbo']);
      })
    );

    const { fetchPollinationsModels } = await importPollinations();
    const models = await fetchPollinationsModels('image');
    expect(models).toEqual([
      { id: 'flux', name: 'flux' },
      { id: 'turbo', name: 'turbo' },
    ]);
  });

  it('handles array-of-objects response', async () => {
    testServer.use(
      http.get('https://image.pollinations.ai/models', () => {
        return HttpResponse.json([
          { id: 'flux', name: 'FLUX.1', type: 'image', capabilities: ['fast'] },
        ]);
      })
    );

    const { fetchPollinationsModels } = await importPollinations();
    const models = await fetchPollinationsModels('image');
    expect(models[0].id).toBe('flux');
    expect(models[0].name).toBe('FLUX.1');
    expect(models[0].type).toBe('image');
    expect(models[0].capabilities).toEqual(['fast']);
  });

  it('returns empty array on failure', async () => {
    const { fetchPollinationsModels } = await importPollinations();
    testServer.use(
      http.get('https://image.pollinations.ai/models', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const models = await fetchPollinationsModels('image');
    expect(models).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    const { fetchPollinationsModels } = await importPollinations();
    testServer.use(
      http.get('https://image.pollinations.ai/models', () => {
        return HttpResponse.error();
      })
    );

    const models = await fetchPollinationsModels('image');
    expect(models).toEqual([]);
  });
});
