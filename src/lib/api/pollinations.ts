import { useSettingsStore } from '@/stores/useSettingsStore';

function getAuthHeaders(): Record<string, string> {
  const key = useSettingsStore.getState().pollinationsKey;
  const headers: Record<string, string> = {};
  if (key) headers['Authorization'] = `Bearer ${key}`;
  return headers;
}

export async function generatePollinationsImage(
  prompt: string,
  options: {
    model?: string;
    width?: number;
    height?: number;
    seed?: number;
    nologo?: boolean;
    enhance?: boolean;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const params = new URLSearchParams();
  if (options.model) params.set('model', options.model);
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.seed !== undefined && options.seed >= 0) params.set('seed', options.seed.toString());
  if (options.nologo !== false) params.set('nologo', 'true');
  if (options.enhance) params.set('enhance', 'true');

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Pollinations image generation failed: ${response.statusText}`);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  return { url: objectUrl, blob };
}

export async function generatePollinationsText(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
  } = {}
): Promise<Response> {
  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      messages,
      model: options.model || 'openai',
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
      top_p: options.topP || 0.9,
      stream: options.stream ?? true,
    }),
  });

  if (!response.ok) throw new Error(`Pollinations text generation failed: ${response.statusText}`);
  return response;
}

export async function generatePollinationsAudio(
  text: string,
  voice: string = 'alloy'
): Promise<{ url: string; blob: Blob }> {
  const encodedText = encodeURIComponent(text);
  const url = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Pollinations audio generation failed: ${response.statusText}`);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  return { url: objectUrl, blob };
}

export async function fetchPollinationsModels(type: 'image' | 'text' | 'audio'): Promise<string[]> {
  try {
    let url: string;
    if (type === 'image') url = 'https://image.pollinations.ai/models';
    else if (type === 'text') url = 'https://text.pollinations.ai/models';
    else url = 'https://text.pollinations.ai/models';

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
