export interface GoogleModelInfo {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'image';
  freeTier: boolean | null;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
}

export async function fetchGoogleModels(apiKey: string): Promise<GoogleModelInfo[]> {
  const res = await fetch('/api/google/models', {
    headers: { 'x-google-api-key': apiKey },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Google models');
  }

  const data = await res.json();
  return data.models || [];
}

export async function generateGoogleText(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<Response> {
  const response = await fetch('/api/google/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-google-api-key': apiKey,
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

export async function generateGoogleImage(
  prompt: string,
  apiKey: string,
  options: {
    model?: string;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const response = await fetch('/api/google/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-google-api-key': apiKey,
    },
    body: JSON.stringify({
      prompt,
      model: options.model,
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
