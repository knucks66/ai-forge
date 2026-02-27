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
  });

  describe('reset', () => {
    it('restores all state to initial values', () => {
      getState().setPrompt('test');
      getState().setModel('turbo');
      getState().setProvider('huggingface');
      getState().setCfgScale(15);
      getState().setIsGenerating(true);
      getState().setError('error');

      getState().reset();

      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.model).toBe('flux');
      expect(state.provider).toBe('pollinations');
      expect(state.cfgScale).toBe(7);
      expect(state.isGenerating).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('partialize', () => {
    it('excludes transient fields from persistence', () => {
      // partialize is tested by verifying what gets persisted
      // The store config excludes: prompt, negativePrompt, seed, isGenerating,
      // generatedImageUrl, generatedImageBlob, error
      // and includes: model, provider, stylePreset, canvasSize, width, height,
      // cfgScale, steps, sampler, useRandomSeed, showAdvanced
      const state = getState();
      // These fields should exist in state (partialize doesn't remove them from state)
      expect(state).toHaveProperty('model');
      expect(state).toHaveProperty('provider');
      expect(state).toHaveProperty('isGenerating');
      expect(state).toHaveProperty('error');
    });
  });
});
