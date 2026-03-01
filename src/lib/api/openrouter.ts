export async function generateOpenRouterText(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<Response> {
  const response = await fetch('/api/openrouter/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openrouter-api-key': apiKey,
    },
    body: JSON.stringify({
      messages,
      model: options.model || 'meta-llama/llama-3.3-70b-instruct:free',
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

export async function generateOpenRouterImage(
  prompt: string,
  apiKey: string,
  options: {
    model?: string;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const response = await fetch('/api/openrouter/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openrouter-api-key': apiKey,
    },
    body: JSON.stringify({
      prompt,
      model: options.model || 'google/gemini-2.5-flash-image-preview:free',
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
