import { ModelCapabilities } from '@/types/models';

/** Pollinations image models that accept a reference `image` param */
export const POLLINATIONS_IMAGE_INPUT_MODELS = new Set([
  'kontext',
  'nanobanana',
  'nanobanana-pro',
  'seedream',
  'seedream-pro',
  'gptimage',
  'gptimage-large',
  'klein',
  'klein-large',
]);

/** Pollinations video model IDs */
export const POLLINATIONS_VIDEO_MODELS = new Set([
  'veo',
  'seedance',
  'seedance-pro',
  'wan',
  'grok-video',
  'ltx-2',
]);

/** HuggingFace models known to support imageTextToImage */
export const HF_IMAGE_INPUT_MODELS = new Set([
  'black-forest-labs/FLUX.2-dev',
  'timbrooks/instruct-pix2pix',
  'stabilityai/stable-diffusion-xl-refiner-1.0',
]);

/** HuggingFace models known to support imageToVideo / imageTextToVideo */
export const HF_IMAGE_TO_VIDEO_MODELS = new Set([
  'stabilityai/stable-video-diffusion-img2vid-xt',
  'ali-vilab/i2vgen-xl',
]);

/**
 * Get capabilities for a Pollinations model based on known model sets
 * and optional API metadata.
 */
export function getPollinationsCapabilities(
  modelId: string,
  apiMeta?: { type?: string; capabilities?: string[] }
): ModelCapabilities {
  const caps: ModelCapabilities = {};

  // Check API metadata first
  if (apiMeta?.capabilities?.includes('image-input')) {
    caps.supportsImageInput = true;
  }
  if (apiMeta?.type === 'video' || apiMeta?.capabilities?.includes('video-output')) {
    caps.supportsVideoOutput = true;
  }
  if (apiMeta?.capabilities?.includes('image-to-video')) {
    caps.supportsImageToVideo = true;
  }

  // Fallback to known model sets
  if (POLLINATIONS_IMAGE_INPUT_MODELS.has(modelId)) {
    caps.supportsImageInput = true;
  }

  if (POLLINATIONS_VIDEO_MODELS.has(modelId)) {
    caps.supportsVideoOutput = true;
    caps.supportsImageToVideo = true;
    caps.supportedVideoParams = { duration: true, aspectRatio: true, audio: true };
  }

  return caps;
}

/**
 * Get capabilities for a HuggingFace model based on task and known model sets.
 */
export function getHfCapabilities(
  modelId: string,
  task?: string
): ModelCapabilities {
  const caps: ModelCapabilities = {};

  if (HF_IMAGE_INPUT_MODELS.has(modelId) || task === 'image-to-image') {
    caps.supportsImageInput = true;
  }

  if (task === 'text-to-video' || task === 'image-to-video') {
    caps.supportsVideoOutput = true;
  }

  if (HF_IMAGE_TO_VIDEO_MODELS.has(modelId) || task === 'image-to-video') {
    caps.supportsImageToVideo = true;
  }

  return caps;
}
