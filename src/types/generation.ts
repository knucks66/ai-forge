export type GenerationType = 'image' | 'text' | 'audio' | 'video';
export type Provider = 'pollinations' | 'huggingface';

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  provider: Provider;
  width?: number;
  height?: number;
  cfgScale?: number;
  steps?: number;
  sampler?: string;
  seed?: number;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  voice?: string;
}

export interface GenerationResult {
  id: string;
  type: GenerationType;
  provider: Provider;
  model: string;
  prompt: string;
  fullPrompt: string;
  params: GenerationParams;
  outputUrl?: string;
  outputBlob?: Blob;
  textContent?: string;
  thumbnail?: Blob;
  createdAt: number;
  durationMs: number;
  error?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  result: GenerationResult | null;
}
