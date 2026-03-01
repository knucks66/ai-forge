import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/stores/useSettingsStore';

const { getState, setState } = useSettingsStore;

beforeEach(() => {
  setState({ hfToken: '', pollinationsKey: '', googleApiKey: '', nsfwEnabled: false });
});

describe('useSettingsStore', () => {
  describe('defaults', () => {
    it('starts with empty tokens', () => {
      expect(getState().hfToken).toBe('');
      expect(getState().pollinationsKey).toBe('');
    });

    it('nsfwEnabled defaults to false', () => {
      expect(getState().nsfwEnabled).toBe(false);
    });
  });

  describe('setHfToken', () => {
    it('sets the HuggingFace token', () => {
      getState().setHfToken('hf_abc123');
      expect(getState().hfToken).toBe('hf_abc123');
    });

    it('can clear the token', () => {
      getState().setHfToken('hf_abc123');
      getState().setHfToken('');
      expect(getState().hfToken).toBe('');
    });
  });

  describe('setPollinationsKey', () => {
    it('sets the Pollinations key', () => {
      getState().setPollinationsKey('pk_xyz789');
      expect(getState().pollinationsKey).toBe('pk_xyz789');
    });

    it('can clear the key', () => {
      getState().setPollinationsKey('pk_xyz789');
      getState().setPollinationsKey('');
      expect(getState().pollinationsKey).toBe('');
    });
  });

  describe('setGoogleApiKey', () => {
    it('sets the Google API key', () => {
      getState().setGoogleApiKey('AIzaSy...');
      expect(getState().googleApiKey).toBe('AIzaSy...');
    });

    it('can clear the key', () => {
      getState().setGoogleApiKey('AIzaSy...');
      getState().setGoogleApiKey('');
      expect(getState().googleApiKey).toBe('');
    });
  });

  describe('setNsfwEnabled', () => {
    it('enables NSFW mode', () => {
      getState().setNsfwEnabled(true);
      expect(getState().nsfwEnabled).toBe(true);
    });

    it('disables NSFW mode', () => {
      getState().setNsfwEnabled(true);
      getState().setNsfwEnabled(false);
      expect(getState().nsfwEnabled).toBe(false);
    });
  });
});
