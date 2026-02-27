import { describe, it, expect } from 'vitest';
import {
  getPollinationsCapabilities,
  getHfCapabilities,
  POLLINATIONS_IMAGE_INPUT_MODELS,
  POLLINATIONS_VIDEO_MODELS,
  HF_IMAGE_INPUT_MODELS,
  HF_IMAGE_TO_VIDEO_MODELS,
} from '@/data/model-capabilities';

describe('model-capabilities', () => {
  describe('POLLINATIONS_IMAGE_INPUT_MODELS', () => {
    it('includes known image-input models', () => {
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('kontext')).toBe(true);
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('klein')).toBe(true);
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('gptimage')).toBe(true);
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('seedream')).toBe(true);
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('nanobanana')).toBe(true);
    });

    it('does not include non-image-input models', () => {
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('flux')).toBe(false);
      expect(POLLINATIONS_IMAGE_INPUT_MODELS.has('turbo')).toBe(false);
    });
  });

  describe('POLLINATIONS_VIDEO_MODELS', () => {
    it('includes known video models', () => {
      expect(POLLINATIONS_VIDEO_MODELS.has('wan')).toBe(true);
      expect(POLLINATIONS_VIDEO_MODELS.has('seedance')).toBe(true);
      expect(POLLINATIONS_VIDEO_MODELS.has('veo')).toBe(true);
      expect(POLLINATIONS_VIDEO_MODELS.has('grok-video')).toBe(true);
      expect(POLLINATIONS_VIDEO_MODELS.has('ltx-2')).toBe(true);
    });
  });

  describe('getPollinationsCapabilities', () => {
    it('returns supportsImageInput for known image-input models', () => {
      const caps = getPollinationsCapabilities('kontext');
      expect(caps.supportsImageInput).toBe(true);
    });

    it('returns video capabilities for video models', () => {
      const caps = getPollinationsCapabilities('wan');
      expect(caps.supportsVideoOutput).toBe(true);
      expect(caps.supportsImageToVideo).toBe(true);
      expect(caps.supportedVideoParams).toEqual({ duration: true, aspectRatio: true, audio: true });
    });

    it('returns empty capabilities for unknown models', () => {
      const caps = getPollinationsCapabilities('unknown-model');
      expect(caps.supportsImageInput).toBeUndefined();
      expect(caps.supportsVideoOutput).toBeUndefined();
    });

    it('respects API metadata for image-input', () => {
      const caps = getPollinationsCapabilities('new-model', {
        capabilities: ['image-input'],
      });
      expect(caps.supportsImageInput).toBe(true);
    });

    it('respects API metadata for video type', () => {
      const caps = getPollinationsCapabilities('new-video', {
        type: 'video',
      });
      expect(caps.supportsVideoOutput).toBe(true);
    });
  });

  describe('getHfCapabilities', () => {
    it('returns supportsImageInput for known HF image-input models', () => {
      const caps = getHfCapabilities('timbrooks/instruct-pix2pix');
      expect(caps.supportsImageInput).toBe(true);
    });

    it('returns supportsImageInput for image-to-image task', () => {
      const caps = getHfCapabilities('some-model', 'image-to-image');
      expect(caps.supportsImageInput).toBe(true);
    });

    it('returns supportsVideoOutput for text-to-video task', () => {
      const caps = getHfCapabilities('some-model', 'text-to-video');
      expect(caps.supportsVideoOutput).toBe(true);
    });

    it('returns supportsImageToVideo for known i2v models', () => {
      const caps = getHfCapabilities('stabilityai/stable-video-diffusion-img2vid-xt');
      expect(caps.supportsImageToVideo).toBe(true);
    });

    it('returns empty capabilities for unknown models', () => {
      const caps = getHfCapabilities('unknown/model');
      expect(caps.supportsImageInput).toBeUndefined();
      expect(caps.supportsVideoOutput).toBeUndefined();
    });
  });
});
