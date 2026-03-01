export type GenerationType = 'image' | 'text' | 'audio' | 'video';
export type Provider = 'pollinations' | 'huggingface' | 'google';

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
  inputImageBlob?: Blob;
  strength?: number;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  audio?: boolean;
}

export type ImageGenerationMode = 'text-to-image' | 'image-to-image';
export type VideoGenerationMode = 'text-to-video' | 'image-to-video';

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
