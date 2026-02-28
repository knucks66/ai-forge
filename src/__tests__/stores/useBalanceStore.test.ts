import { describe, it, expect, beforeEach } from 'vitest';
import { useBalanceStore } from '@/stores/useBalanceStore';

const { getState, setState } = useBalanceStore;

beforeEach(() => {
  setState({
    pollinations: null,
    huggingface: null,
    isLoadingPollinations: false,
    isLoadingHuggingface: false,
  });
});

describe('useBalanceStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      expect(getState().pollinations).toBeNull();
      expect(getState().huggingface).toBeNull();
      expect(getState().isLoadingPollinations).toBe(false);
      expect(getState().isLoadingHuggingface).toBe(false);
    });
  });

  describe('setPollinationsAccount', () => {
    it('sets pollinations account data', () => {
      getState().setPollinationsAccount({ balance: 5.42, tier: 'seed' });
      expect(getState().pollinations).toEqual({ balance: 5.42, tier: 'seed' });
    });

    it('sets pollinations account without tier', () => {
      getState().setPollinationsAccount({ balance: 10 });
      expect(getState().pollinations).toEqual({ balance: 10 });
    });

    it('clears pollinations account when set to null', () => {
      getState().setPollinationsAccount({ balance: 5 });
      getState().setPollinationsAccount(null);
      expect(getState().pollinations).toBeNull();
    });
  });

  describe('setHuggingfaceAccount', () => {
    it('sets huggingface account data', () => {
      getState().setHuggingfaceAccount({ username: 'testuser', plan: 'pro' });
      expect(getState().huggingface).toEqual({ username: 'testuser', plan: 'pro' });
    });

    it('clears huggingface account when set to null', () => {
      getState().setHuggingfaceAccount({ username: 'testuser', plan: 'free' });
      getState().setHuggingfaceAccount(null);
      expect(getState().huggingface).toBeNull();
    });
  });

  describe('loading states', () => {
    it('sets pollinations loading state', () => {
      getState().setIsLoadingPollinations(true);
      expect(getState().isLoadingPollinations).toBe(true);
      getState().setIsLoadingPollinations(false);
      expect(getState().isLoadingPollinations).toBe(false);
    });

    it('sets huggingface loading state', () => {
      getState().setIsLoadingHuggingface(true);
      expect(getState().isLoadingHuggingface).toBe(true);
      getState().setIsLoadingHuggingface(false);
      expect(getState().isLoadingHuggingface).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('clears all account data', () => {
      getState().setPollinationsAccount({ balance: 5.42, tier: 'seed' });
      getState().setHuggingfaceAccount({ username: 'testuser', plan: 'pro' });
      getState().clearAll();
      expect(getState().pollinations).toBeNull();
      expect(getState().huggingface).toBeNull();
    });

    it('does not affect loading states', () => {
      getState().setIsLoadingPollinations(true);
      getState().setIsLoadingHuggingface(true);
      getState().clearAll();
      expect(getState().isLoadingPollinations).toBe(true);
      expect(getState().isLoadingHuggingface).toBe(true);
    });
  });
});
