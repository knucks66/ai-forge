import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoStore } from '@/stores/useVideoStore';

const { getState, setState } = useVideoStore;

beforeEach(() => {
  setState({
    prompt: '',
    model: 'wan',
    provider: 'pollinations',
    mode: 'text-to-video',
    inputImageUrl: null,
    inputImageBlob: null,
    duration: 5,
    aspectRatio: '16:9',
    audio: false,
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
      expect(state.model).toBe('wan');
      expect(state.provider).toBe('pollinations');
      expect(state.mode).toBe('text-to-video');
      expect(state.inputImageUrl).toBeNull();
      expect(state.inputImageBlob).toBeNull();
      expect(state.duration).toBe(5);
      expect(state.aspectRatio).toBe('16:9');
      expect(state.audio).toBe(false);
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
      getState().setModel('seedance');
      expect(getState().model).toBe('seedance');
    });

    it('setProvider', () => {
      getState().setProvider('huggingface');
      expect(getState().provider).toBe('huggingface');
    });

    it('setMode', () => {
      getState().setMode('image-to-video');
      expect(getState().mode).toBe('image-to-video');
    });

    it('setDuration', () => {
      getState().setDuration(8);
      expect(getState().duration).toBe(8);
    });

    it('setAspectRatio', () => {
      getState().setAspectRatio('9:16');
      expect(getState().aspectRatio).toBe('9:16');
    });

    it('setAudio', () => {
      getState().setAudio(true);
      expect(getState().audio).toBe(true);
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

  describe('setInputImage', () => {
    it('sets input image and auto-switches to image-to-video mode', () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      getState().setInputImage('blob:url', blob);
      expect(getState().inputImageUrl).toBe('blob:url');
      expect(getState().inputImageBlob).toBe(blob);
      expect(getState().mode).toBe('image-to-video');
    });

    it('switches to text-to-video when url is null', () => {
      getState().setMode('image-to-video');
      getState().setInputImage(null, null);
      expect(getState().mode).toBe('text-to-video');
    });
  });

  describe('clearInputImage', () => {
    it('clears input image and resets to text-to-video', () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      getState().setInputImage('blob:url', blob);
      expect(getState().mode).toBe('image-to-video');

      getState().clearInputImage();
      expect(getState().inputImageUrl).toBeNull();
      expect(getState().inputImageBlob).toBeNull();
      expect(getState().mode).toBe('text-to-video');
    });
  });

  describe('reset', () => {
    it('resets transient state but preserves model', () => {
      getState().setModel('seedance');
      getState().setPrompt('test prompt');
      getState().setVideoUrl('blob:url');
      getState().setError('err');
      getState().setIsGenerating(true);
      getState().setProgress(75);
      const blob = new Blob(['img'], { type: 'image/png' });
      getState().setInputImage('blob:img', blob);

      getState().reset();

      const state = getState();
      expect(state.prompt).toBe('');
      expect(state.videoUrl).toBeNull();
      expect(state.videoBlob).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isGenerating).toBe(false);
      expect(state.progress).toBe(0);
      expect(state.inputImageUrl).toBeNull();
      expect(state.inputImageBlob).toBeNull();
      expect(state.mode).toBe('text-to-video');
      // model is preserved (not reset by reset())
      expect(state.model).toBe('seedance');
    });
  });
});
