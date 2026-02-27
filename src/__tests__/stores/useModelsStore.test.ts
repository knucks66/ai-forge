import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useModelsStore } from '@/stores/useModelsStore';
import { defaultImageModels, defaultTextModels, defaultAudioModels, defaultVideoModels } from '@/data/default-models';

const { getState, setState } = useModelsStore;

beforeEach(() => {
  setState({
    imageModels: defaultImageModels,
    textModels: defaultTextModels,
    audioModels: defaultAudioModels,
    videoModels: defaultVideoModels,
    lastFetched: {},
    isLoading: false,
  });
});

describe('useModelsStore', () => {
  describe('defaults', () => {
    it('starts with default model arrays', () => {
      expect(getState().imageModels).toEqual(defaultImageModels);
      expect(getState().textModels).toEqual(defaultTextModels);
      expect(getState().audioModels).toEqual(defaultAudioModels);
      expect(getState().videoModels).toEqual(defaultVideoModels);
    });

    it('starts with empty lastFetched', () => {
      expect(getState().lastFetched).toEqual({});
    });

    it('starts not loading', () => {
      expect(getState().isLoading).toBe(false);
    });
  });

  describe('model setters', () => {
    it('setImageModels replaces the array', () => {
      const newModels = [{ id: 'test', name: 'Test', provider: 'pollinations' as const, type: 'image' as const }];
      getState().setImageModels(newModels);
      expect(getState().imageModels).toEqual(newModels);
    });

    it('setTextModels replaces the array', () => {
      const newModels = [{ id: 'test', name: 'Test', provider: 'pollinations' as const, type: 'text' as const }];
      getState().setTextModels(newModels);
      expect(getState().textModels).toEqual(newModels);
    });

    it('setAudioModels replaces the array', () => {
      const newModels = [{ id: 'test', name: 'Test', provider: 'pollinations' as const, type: 'audio' as const }];
      getState().setAudioModels(newModels);
      expect(getState().audioModels).toEqual(newModels);
    });

    it('setVideoModels replaces the array', () => {
      const newModels = [{ id: 'test', name: 'Test', provider: 'huggingface' as const, type: 'video' as const }];
      getState().setVideoModels(newModels);
      expect(getState().videoModels).toEqual(newModels);
    });
  });

  describe('setIsLoading', () => {
    it('sets loading state', () => {
      getState().setIsLoading(true);
      expect(getState().isLoading).toBe(true);
      getState().setIsLoading(false);
      expect(getState().isLoading).toBe(false);
    });
  });

  describe('setLastFetched', () => {
    it('sets timestamp for a key', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));

      getState().setLastFetched('image');
      expect(getState().lastFetched['image']).toBe(new Date('2025-06-15T12:00:00Z').getTime());

      vi.useRealTimers();
    });

    it('merges with existing lastFetched entries', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
      getState().setLastFetched('image');

      vi.setSystemTime(new Date('2025-06-15T13:00:00Z'));
      getState().setLastFetched('text');

      expect(getState().lastFetched['image']).toBe(new Date('2025-06-15T12:00:00Z').getTime());
      expect(getState().lastFetched['text']).toBe(new Date('2025-06-15T13:00:00Z').getTime());

      vi.useRealTimers();
    });
  });

  describe('isStale', () => {
    it('returns true when key has never been fetched', () => {
      expect(getState().isStale('image')).toBe(true);
    });

    it('returns false when recently fetched (within 1 hour)', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      getState().setLastFetched('image');

      // Advance 30 minutes
      vi.setSystemTime(now + 30 * 60 * 1000);
      expect(getState().isStale('image')).toBe(false);

      vi.useRealTimers();
    });

    it('returns true when fetched more than 1 hour ago', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      getState().setLastFetched('image');

      // Advance 61 minutes
      vi.setSystemTime(now + 61 * 60 * 1000);
      expect(getState().isStale('image')).toBe(true);

      vi.useRealTimers();
    });

    it('returns true at exactly the TTL boundary', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      getState().setLastFetched('image');

      // Advance exactly 1 hour + 1ms
      vi.setSystemTime(now + 60 * 60 * 1000 + 1);
      expect(getState().isStale('image')).toBe(true);

      vi.useRealTimers();
    });
  });
});
