import { http, HttpResponse } from 'msw';

// Helper: create a fake binary response (use ArrayBuffer, not Blob, for jsdom compat)
function binaryResponse(data: string, contentType: string) {
  const buffer = new TextEncoder().encode(data).buffer;
  return new HttpResponse(buffer, {
    headers: { 'Content-Type': contentType },
  });
}

export const handlers = [
  // Pollinations image generation
  http.get('https://image.pollinations.ai/prompt/:prompt', () => {
    return binaryResponse('fake-image-data', 'image/png');
  }),

  // Pollinations text generation
  http.post('https://text.pollinations.ai/', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.stream) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: {"content":" world"}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new HttpResponse(stream, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }
    return HttpResponse.json('Enhanced prompt with rich detail');
  }),

  // Pollinations audio generation
  http.get('https://text.pollinations.ai/*', ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('model') === 'openai-audio') {
      return binaryResponse('fake-audio-data', 'audio/mpeg');
    }
    return HttpResponse.json(['model-1', 'model-2']);
  }),

  // Pollinations models
  http.get('https://image.pollinations.ai/models', () => {
    return HttpResponse.json(['flux', 'turbo', 'flux-realism']);
  }),

  http.get('https://text.pollinations.ai/models', () => {
    return HttpResponse.json(['openai', 'mistral', 'llama']);
  }),

  // HuggingFace whoami (connection test)
  http.get('https://huggingface.co/api/whoami-v2', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer valid-token') {
      return HttpResponse.json({ name: 'test-user' });
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
