import { describe, it, expect, beforeEach } from 'vitest';
import { useAudioStore } from '@/stores/useAudioStore';

const { getState, setState } = useAudioStore;

beforeEach(() => {
  setState({
    text: '',
    voice: 'alloy',
    model: 'openai-audio',
    isGenerating: false,
    audioUrl: null,
    audioBlob: null,
    error: null,
  });
});

describe('useAudioStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      const state = getState();
      expect(state.text).toBe('');
      expect(state.voice).toBe('alloy');
      expect(state.model).toBe('openai-audio');
      expect(state.isGenerating).toBe(false);
      expect(state.audioUrl).toBeNull();
      expect(state.audioBlob).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('setters', () => {
    it('setText', () => {
      getState().setText('Hello world');
      expect(getState().text).toBe('Hello world');
    });

    it('setVoice', () => {
      getState().setVoice('nova');
      expect(getState().voice).toBe('nova');
    });

    it('setModel', () => {
      getState().setModel('new-model');
      expect(getState().model).toBe('new-model');
    });

    it('setIsGenerating', () => {
      getState().setIsGenerating(true);
      expect(getState().isGenerating).toBe(true);
    });

    it('setAudioUrl', () => {
      getState().setAudioUrl('blob:test');
      expect(getState().audioUrl).toBe('blob:test');
    });

    it('setAudioBlob', () => {
      const blob = new Blob(['audio'], { type: 'audio/mpeg' });
      getState().setAudioBlob(blob);
      expect(getState().audioBlob).toBe(blob);
    });

    it('setError', () => {
      getState().setError('Audio failed');
      expect(getState().error).toBe('Audio failed');
    });
  });

  describe('reset', () => {
    it('resets transient state but preserves voice and model', () => {
      getState().setVoice('nova');
      getState().setModel('custom-model');
      getState().setText('Some text');
      getState().setAudioUrl('blob:url');
      getState().setError('an error');
      getState().setIsGenerating(true);

      getState().reset();

      const state = getState();
      expect(state.text).toBe('');
      expect(state.audioUrl).toBeNull();
      expect(state.audioBlob).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isGenerating).toBe(false);
      // voice and model are preserved by partialize (persist),
      // but reset() only resets the listed fields
      expect(state.voice).toBe('nova');
      expect(state.model).toBe('custom-model');
    });
  });
});
