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

export async function generateHfImageToImage(
  prompt: string,
  imageBlob: Blob,
  token: string,
  options: {
    model?: string;
    negativePrompt?: string;
    strength?: number;
    guidanceScale?: number;
    numInferenceSteps?: number;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const formData = new FormData();
  formData.append('image', imageBlob);
  formData.append('prompt', prompt);
  if (options.model) formData.append('model', options.model);
  if (options.negativePrompt) formData.append('negativePrompt', options.negativePrompt);
  if (options.strength !== undefined) formData.append('strength', options.strength.toString());
  if (options.guidanceScale !== undefined) formData.append('guidanceScale', options.guidanceScale.toString());
  if (options.numInferenceSteps !== undefined) formData.append('numInferenceSteps', options.numInferenceSteps.toString());

  const response = await fetch('/api/hf/image-to-image', {
    method: 'POST',
    headers: { 'x-hf-token': token },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Image-to-image generation failed' }));
    throw new Error(error.error || 'Image-to-image generation failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return { url, blob };
}

export async function generateHfImageToVideo(
  prompt: string,
  imageBlob: Blob,
  token: string,
  model?: string
): Promise<{ url: string; blob: Blob }> {
  const formData = new FormData();
  formData.append('image', imageBlob);
  if (prompt) formData.append('prompt', prompt);
  if (model) formData.append('model', model);

  const response = await fetch('/api/hf/image-to-video', {
    method: 'POST',
    headers: { 'x-hf-token': token },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Image-to-video generation failed' }));
    throw new Error(error.error || 'Image-to-video generation failed');
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
