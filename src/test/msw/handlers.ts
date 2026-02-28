import { http, HttpResponse } from 'msw';

const POLL_BASE = 'https://gen.pollinations.ai';

// Helper: create a fake binary response (use ArrayBuffer, not Blob, for jsdom compat)
function binaryResponse(data: string, contentType: string) {
  const buffer = new TextEncoder().encode(data).buffer;
  return new HttpResponse(buffer, {
    headers: { 'Content-Type': contentType },
  });
}

export const handlers = [
  // Pollinations image/models MUST come before /image/:prompt to avoid being caught
  http.get(`${POLL_BASE}/image/models`, () => {
    return HttpResponse.json([
      { name: 'flux', description: 'Flux Schnell', input_modalities: ['text'], output_modalities: ['image'], pricing: { currency: 'pollen', completionImageTokens: 0.001 } },
      { name: 'turbo', description: 'Turbo', input_modalities: ['text'], output_modalities: ['image'], pricing: { currency: 'pollen', completionImageTokens: 0.002 } },
      { name: 'flux-realism', description: 'Flux Realism', input_modalities: ['text'], output_modalities: ['image'], paid_only: true, pricing: { currency: 'pollen', completionImageTokens: 0.04 } },
    ]);
  }),

  // Pollinations image generation (new API: /image/{prompt})
  http.get(`${POLL_BASE}/image/:prompt`, () => {
    return binaryResponse('fake-image-data', 'image/png');
  }),

  // Pollinations text generation (OpenAI-compatible)
  http.post(`${POLL_BASE}/v1/chat/completions`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.stream) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":" world"}}]}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new HttpResponse(stream, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }
    return HttpResponse.json({ choices: [{ message: { content: 'Enhanced prompt with rich detail' } }] });
  }),

  // Pollinations audio generation
  http.get(`${POLL_BASE}/text/*`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('model') === 'openai-audio') {
      return binaryResponse('fake-audio-data', 'audio/mpeg');
    }
    return HttpResponse.json(['model-1', 'model-2']);
  }),

  // Pollinations text/general models
  http.get(`${POLL_BASE}/models`, () => {
    return HttpResponse.json([
      { name: 'openai', description: 'GPT-5 Mini', input_modalities: ['text'], output_modalities: ['text'], pricing: { currency: 'pollen', promptTextTokens: 0.000002 } },
      { name: 'mistral', description: 'Mistral', input_modalities: ['text'], output_modalities: ['text'], pricing: { currency: 'pollen', promptTextTokens: 0.000001 } },
      { name: 'polly', description: 'Polly', input_modalities: ['text'], output_modalities: ['text'] },
    ]);
  }),

  // Pollinations account balance
  http.get(`${POLL_BASE}/account/balance`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ balance: 5.42 });
  }),

  // Pollinations account profile
  http.get(`${POLL_BASE}/account/profile`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ tier: 'seed', next_reset: '2026-03-01' });
  }),

  // HuggingFace whoami (connection test)
  http.get('https://huggingface.co/api/whoami-v2', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer valid-token') {
      return HttpResponse.json({ name: 'test-user', canPay: false });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // HuggingFace models API
  http.get('https://huggingface.co/api/models', () => {
    return HttpResponse.json([
      { modelId: 'org/model-1', id: 'org/model-1', description: 'A test model', tags: ['test'] },
      { modelId: 'org/model-2', id: 'org/model-2', description: 'Another model', tags: ['test'] },
    ]);
  }),

  // Local API routes (proxied HF endpoints)
  http.post('/api/hf/image', async ({ request }) => {
    const token = request.headers.get('x-hf-token');
    if (!token) {
      return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }
    return binaryResponse('fake-hf-image', 'image/png');
  }),

  http.post('/api/hf/text', async ({ request }) => {
    const token = request.headers.get('x-hf-token');
    if (!token) {
      return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: {"content":"HF response"}\n\n'));
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }),

  http.post('/api/hf/video', async ({ request }) => {
    const token = request.headers.get('x-hf-token');
    if (!token) {
      return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }
    return binaryResponse('fake-hf-video', 'video/mp4');
  }),

  http.post('/api/hf/image-to-image', async ({ request }) => {
    const token = request.headers.get('x-hf-token');
    if (!token) {
      return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }
    return binaryResponse('fake-hf-image-to-image', 'image/png');
  }),

  http.post('/api/hf/image-to-video', async ({ request }) => {
    const token = request.headers.get('x-hf-token');
    if (!token) {
      return HttpResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }
    return binaryResponse('fake-hf-image-to-video', 'video/mp4');
  }),

  http.get('/api/hf/models', ({ request }) => {
    const url = new URL(request.url, 'http://localhost');
    const task = url.searchParams.get('task') || 'text-to-image';
    return HttpResponse.json([
      { id: 'org/model-1', name: 'model-1', provider: 'huggingface', type: task === 'text-to-image' ? 'image' : 'text' },
    ]);
  }),

  // Enhance prompt
  http.post('/api/enhance-prompt', async () => {
    return HttpResponse.json({ enhanced: 'A beautifully enhanced prompt with vivid details' });
  }),
];
