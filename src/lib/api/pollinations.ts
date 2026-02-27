import { useSettingsStore } from '@/stores/useSettingsStore';

function getAuthHeaders(): Record<string, string> {
  const key = useSettingsStore.getState().pollinationsKey;
  const headers: Record<string, string> = {};
  if (key) headers['Authorization'] = `Bearer ${key}`;
  return headers;
}

export interface PollinationsModelInfo {
  id: string;
  name: string;
  type?: string;
  capabilities?: string[];
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
    image?: string;
    negative_prompt?: string;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const params = new URLSearchParams();
  if (options.model) params.set('model', options.model);
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.seed !== undefined && options.seed >= 0) params.set('seed', options.seed.toString());
  if (options.nologo !== false) params.set('nologo', 'true');
  if (options.enhance) params.set('enhance', 'true');
  if (options.image) params.set('image', options.image);
  if (options.negative_prompt) params.set('negative_prompt', options.negative_prompt);

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Pollinations image generation failed: ${response.statusText}`);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  return { url: objectUrl, blob };
}

export async function generatePollinationsVideo(
  prompt: string,
  options: {
    model?: string;
    duration?: number;
    aspectRatio?: string;
    audio?: boolean;
    image?: string;
  } = {}
): Promise<{ url: string; blob: Blob }> {
  const params = new URLSearchParams();
  if (options.model) params.set('model', options.model);
  if (options.duration) params.set('duration', options.duration.toString());
  if (options.aspectRatio) params.set('aspect_ratio', options.aspectRatio);
  if (options.audio !== undefined) params.set('audio', options.audio.toString());
  if (options.image) params.set('image', options.image);
  params.set('nologo', 'true');

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Pollinations video generation failed: ${response.statusText}`);

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

/**
 * Fetch available models from Pollinations.
 * Handles both array-of-strings and array-of-objects response formats.
 */
export async function fetchPollinationsModels(
  type: 'image' | 'text' | 'audio'
): Promise<PollinationsModelInfo[]> {
  try {
    let url: string;
    if (type === 'image') url = 'https://image.pollinations.ai/models';
    else if (type === 'text') url = 'https://text.pollinations.ai/models';
    else url = 'https://text.pollinations.ai/models';

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) return [];

    const data = await response.json();

    // Handle both response formats
    if (Array.isArray(data)) {
      return data.map((item: string | PollinationsModelInfo) => {
        if (typeof item === 'string') {
          return { id: item, name: item };
        }
        return {
          id: item.id || '',
          name: item.name || item.id || '',
          type: item.type,
          capabilities: item.capabilities,
        };
      });
    }

    return [];
  } catch {
    return [];
  }
}
