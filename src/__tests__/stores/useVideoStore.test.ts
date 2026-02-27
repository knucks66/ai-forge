import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoStore } from '@/stores/useVideoStore';

const { getState, setState } = useVideoStore;

beforeEach(() => {
  setState({
    prompt: '',
    model: 'ali-vilab/text-to-video-ms-1.7b',
    provider: 'huggingface',
    isGenerating: false,
    videoUrl: null,
    videoBlob: null,
    error: null,
    progress: 0,
  });
});

describe('useVideoStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.model).toBe('ali-vilab/text-to-video-ms-1.7b');
      expect(state.provider).toBe('huggingface');
      expect(state.isGenerating).toBe(false);
      expect(state.videoUrl).toBeNull();
      expect(state.progress).toBe(0);
    });
  });

  describe('setters', () => {
    it('setPrompt', () => {
      getState().setPrompt('A sunset');
      expect(getState().prompt).toBe('A sunset');
    });

    it('setModel', () => {
      getState().setModel('new-video-model');
      expect(getState().model).toBe('new-video-model');
    });

    it('setIsGenerating', () => {
      getState().setIsGenerating(true);
      expect(getState().isGenerating).toBe(true);
    });

    it('setVideoUrl', () => {
      getState().setVideoUrl('blob:video');
      expect(getState().videoUrl).toBe('blob:video');
    });

    it('setVideoBlob', () => {
      const blob = new Blob(['video'], { type: 'video/mp4' });
      getState().setVideoBlob(blob);
      expect(getState().videoBlob).toBe(blob);
    });

    it('setError', () => {
      getState().setError('Video gen failed');
      expect(getState().error).toBe('Video gen failed');
    });

    it('setProgress', () => {
      getState().setProgress(50);
      expect(getState().progress).toBe(50);
    });
  });

  describe('reset', () => {
    it('resets transient state but preserves model', () => {
      getState().setModel('custom-model');
      getState().setPrompt('test prompt');
      getState().setVideoUrl('blob:url');
      getState().setError('err');
      getState().setIsGenerating(true);
      getState().setProgress(75);

      getState().reset();

      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.videoUrl).toBeNull();
      expect(state.videoBlob).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isGenerating).toBe(false);
      expect(state.progress).toBe(0);
      // model is preserved (not reset by reset())
      expect(state.model).toBe('custom-model');
    });
  });
});
