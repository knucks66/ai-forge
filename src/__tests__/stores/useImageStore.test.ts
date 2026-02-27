import { describe, it, expect, beforeEach } from 'vitest';
import { useImageStore } from '@/stores/useImageStore';

const { getState, setState } = useImageStore;

const initialState = {
  prompt: '',
  negativePrompt: '',
  model: 'flux',
  provider: 'pollinations' as const,
  stylePreset: 'none',
  canvasSize: 'square',
  width: 512,
  height: 512,
  cfgScale: 7,
  steps: 30,
  sampler: 'euler_a',
  seed: -1,
  useRandomSeed: true,
  isGenerating: false,
  generatedImageUrl: null,
  generatedImageBlob: null,
  error: null,
  showAdvanced: false,
  mode: 'text-to-image' as const,
  inputImageUrl: null,
  inputImageBlob: null,
  strength: 0.75,
};

beforeEach(() => {
  setState(initialState);
});

describe('useImageStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.model).toBe('flux');
      expect(state.provider).toBe('pollinations');
      expect(state.canvasSize).toBe('square');
      expect(state.width).toBe(512);
      expect(state.height).toBe(512);
      expect(state.cfgScale).toBe(7);
      expect(state.steps).toBe(30);
      expect(state.useRandomSeed).toBe(true);
      expect(state.isGenerating).toBe(false);
      expect(state.generatedImageUrl).toBeNull();
      expect(state.error).toBeNull();
      expect(state.mode).toBe('text-to-image');
      expect(state.inputImageUrl).toBeNull();
      expect(state.inputImageBlob).toBeNull();
      expect(state.strength).toBe(0.75);
    });
  });

  describe('setters', () => {
    it('setPrompt', () => {
      getState().setPrompt('a cat');
      expect(getState().prompt).toBe('a cat');
    });

    it('setNegativePrompt', () => {
      getState().setNegativePrompt('ugly');
      expect(getState().negativePrompt).toBe('ugly');
    });

    it('setModel', () => {
      getState().setModel('turbo');
      expect(getState().model).toBe('turbo');
    });

    it('setProvider', () => {
      getState().setProvider('huggingface');
      expect(getState().provider).toBe('huggingface');
    });

    it('setStylePreset', () => {
      getState().setStylePreset('anime');
      expect(getState().stylePreset).toBe('anime');
    });

    it('setCanvasSize', () => {
      getState().setCanvasSize('landscape');
      expect(getState().canvasSize).toBe('landscape');
    });

    it('setWidth and setHeight', () => {
      getState().setWidth(1024);
      getState().setHeight(768);
      expect(getState().width).toBe(1024);
      expect(getState().height).toBe(768);
    });

    it('setCfgScale', () => {
      getState().setCfgScale(12);
      expect(getState().cfgScale).toBe(12);
    });

    it('setSteps', () => {
      getState().setSteps(50);
      expect(getState().steps).toBe(50);
    });

    it('setSampler', () => {
      getState().setSampler('ddim');
      expect(getState().sampler).toBe('ddim');
    });

    it('setSeed', () => {
      getState().setSeed(42);
      expect(getState().seed).toBe(42);
    });

    it('setUseRandomSeed', () => {
      getState().setUseRandomSeed(false);
      expect(getState().useRandomSeed).toBe(false);
    });

    it('setIsGenerating', () => {
      getState().setIsGenerating(true);
      expect(getState().isGenerating).toBe(true);
    });

    it('setGeneratedImageUrl', () => {
      getState().setGeneratedImageUrl('blob:test');
      expect(getState().generatedImageUrl).toBe('blob:test');
    });

    it('setError', () => {
      getState().setError('something broke');
      expect(getState().error).toBe('something broke');
    });

    it('setShowAdvanced', () => {
      getState().setShowAdvanced(true);
      expect(getState().showAdvanced).toBe(true);
    });

    it('setMode', () => {
      getState().setMode('image-to-image');
      expect(getState().mode).toBe('image-to-image');
    });

    it('setStrength', () => {
      getState().setStrength(0.5);
      expect(getState().strength).toBe(0.5);
    });
  });

  describe('setInputImage', () => {
    it('sets inputImage and auto-switches to image-to-image mode', () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      getState().setInputImage('blob:test-url', blob);
      expect(getState().inputImageUrl).toBe('blob:test-url');
      expect(getState().inputImageBlob).toBe(blob);
      expect(getState().mode).toBe('image-to-image');
    });

    it('sets mode to text-to-image when url is null', () => {
      getState().setMode('image-to-image');
      getState().setInputImage(null, null);
      expect(getState().mode).toBe('text-to-image');
    });
  });

  describe('clearInputImage', () => {
    it('clears input image and resets to text-to-image', () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      getState().setInputImage('blob:url', blob);
      expect(getState().mode).toBe('image-to-image');

      getState().clearInputImage();
      expect(getState().inputImageUrl).toBeNull();
      expect(getState().inputImageBlob).toBeNull();
      expect(getState().mode).toBe('text-to-image');
    });
  });

  describe('refineCurrentImage', () => {
    it('moves generated image to input image', () => {
      const blob = new Blob(['generated'], { type: 'image/png' });
      getState().setGeneratedImageUrl('blob:generated');
      getState().setGeneratedImageBlob(blob);

      getState().refineCurrentImage();

      expect(getState().inputImageUrl).toBe('blob:generated');
      expect(getState().inputImageBlob).toBe(blob);
      expect(getState().generatedImageUrl).toBeNull();
      expect(getState().generatedImageBlob).toBeNull();
      expect(getState().mode).toBe('image-to-image');
    });

    it('does nothing when no generated image exists', () => {
      getState().refineCurrentImage();
      expect(getState().inputImageUrl).toBeNull();
      expect(getState().inputImageBlob).toBeNull();
      expect(getState().mode).toBe('text-to-image');
    });
  });

  describe('reset', () => {
    it('restores all state to initial values', () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      getState().setPrompt('test');
      getState().setModel('turbo');
      getState().setProvider('huggingface');
      getState().setCfgScale(15);
      getState().setIsGenerating(true);
      getState().setError('error');
      getState().setInputImage('blob:url', blob);
      getState().setStrength(0.5);

      getState().reset();

      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.model).toBe('flux');
      expect(state.provider).toBe('pollinations');
      expect(state.cfgScale).toBe(7);
      expect(state.isGenerating).toBe(false);
      expect(state.error).toBeNull();
      expect(state.mode).toBe('text-to-image');
      expect(state.inputImageUrl).toBeNull();
      expect(state.inputImageBlob).toBeNull();
      expect(state.strength).toBe(0.75);
    });
  });

  describe('partialize', () => {
    it('excludes transient fields from persistence', () => {
      const state = getState();
      expect(state).toHaveProperty('model');
      expect(state).toHaveProperty('provider');
      expect(state).toHaveProperty('isGenerating');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('strength');
    });
  });
});
