export async function generateHfImage(
  prompt: string,
  token: string,
  options: {
    model?: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    guidanceScale?: number;
    numInferenceSteps?: number;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const response = await fetch('/api/hf/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hf-token': token,
    },
    body: JSON.stringify({
      prompt,
      model: options.model,
      negativePrompt: options.negativePrompt,
      width: options.width || 512,
      height: options.height || 512,
      guidanceScale: options.guidanceScale || 7,
      numInferenceSteps: options.numInferenceSteps || 30,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Image generation failed' }));
    throw new Error(error.error || 'Image generation failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return { url, blob };
}

export async function generateHfText(
  messages: Array<{ role: string; content: string }>,
  token: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<Response> {
  const response = await fetch('/api/hf/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hf-token': token,
    },
    body: JSON.stringify({
      messages,
      model: options.model,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 2048,
      topP: options.topP || 0.9,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Text generation failed' }));
    throw new Error(error.error || 'Text generation failed');
  }

  return response;
}

export async function generateHfVideo(
  prompt: string,
  token: string,
  model?: string
): Promise<{ url: string; blob: Blob }> {
  const response = await fetch('/api/hf/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hf-token': token,
    },
    body: JSON.stringify({ prompt, model }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Video generation failed' }));
    throw new Error(error.error || 'Video generation failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return { url, blob };
}

export async function fetchHfModels(
  task: string,
  token?: string
): Promise<Array<{ id: string; name: string; provider: string; type: string; description?: string; tags?: string[] }>> {
  const headers: Record<string, string> = {};
  if (token) headers['x-hf-token'] = token;

  const response = await fetch(`/api/hf/models?task=${task}`, { headers });
  if (!response.ok) return [];
  return response.json();
}
