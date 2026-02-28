import { useSettingsStore } from '@/stores/useSettingsStore';

const BASE_URL = 'https://gen.pollinations.ai';

/**
 * Build auth headers for Pollinations API.
 * The new gen.pollinations.ai API accepts Bearer tokens and
 * handles CORS properly, unlike the old image.pollinations.ai.
 */
function getAuthHeaders(): Record<string, string> {
  const key = useSettingsStore.getState().pollinationsKey;
  const headers: Record<string, string> = {};
  if (key) headers['Authorization'] = `Bearer ${key}`;
  return headers;
}

export interface PollinationsModelInfo {
  id: string;
  name: string;
  description?: string;
  input_modalities?: string[];
  output_modalities?: string[];
  paid_only?: boolean;
  costsCredits?: boolean;
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
  const url = `${BASE_URL}/image/${encodedPrompt}?${params.toString()}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = errBody?.error?.message || response.statusText;
    throw new Error(`Pollinations image generation failed: ${msg}`);
  }

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
  const url = `${BASE_URL}/image/${encodedPrompt}?${params.toString()}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = errBody?.error?.message || response.statusText;
    throw new Error(`Pollinations video generation failed: ${msg}`);
  }

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
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
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
  const url = `${BASE_URL}/text/${encodedText}?model=openai-audio&voice=${voice}`;

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Pollinations audio generation failed: ${response.statusText}`);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  return { url: objectUrl, blob };
}

export async function fetchPollinationsBalance(): Promise<{ balance: number } | null> {
  try {
    const res = await fetch(`${BASE_URL}/account/balance`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchPollinationsProfile(): Promise<{ tier?: string; next_reset?: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/account/profile`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch available models from Pollinations.
 * The /models endpoint returns rich model objects; /image/models returns image/video models.
 */
export async function fetchPollinationsModels(
  type: 'image' | 'text' | 'audio'
): Promise<PollinationsModelInfo[]> {
  try {
    const url = type === 'image'
      ? `${BASE_URL}/image/models`
      : `${BASE_URL}/models`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) return [];

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((item: string | Record<string, unknown>) => {
        if (typeof item === 'string') {
          return { id: item, name: item };
        }
        const pricing = item.pricing as Record<string, unknown> | undefined;
        const costsCredits = pricing
          ? Object.entries(pricing).some(([k, v]) => k !== 'currency' && typeof v === 'number' && v > 0)
          : false;
        return {
          id: (item.name as string) || '',
          name: (item.description as string) || (item.name as string) || '',
          input_modalities: item.input_modalities as string[] | undefined,
          output_modalities: item.output_modalities as string[] | undefined,
          paid_only: item.paid_only as boolean | undefined,
          costsCredits,
        };
      });
    }

    return [];
  } catch {
    return [];
  }
}
