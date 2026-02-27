import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/stores/useSettingsStore';

const { getState, setState } = useSettingsStore;

beforeEach(() => {
  setState({ hfToken: '', pollinationsKey: '' });
});

describe('useSettingsStore', () => {
  describe('defaults', () => {
    it('starts with empty tokens', () => {
      expect(getState().hfToken).toBe('');
      expect(getState().pollinationsKey).toBe('');
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
});
