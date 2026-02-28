'use client';

import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { fetchPollinationsBalance, fetchPollinationsProfile } from '@/lib/api/pollinations';
import { fetchHfAccountInfo } from '@/lib/api/huggingface';

export function useBalance() {
  const pollinationsKey = useSettingsStore((s) => s.pollinationsKey);
  const hfToken = useSettingsStore((s) => s.hfToken);
  const store = useBalanceStore();

  const refreshPollinations = useCallback(async () => {
    if (!pollinationsKey) {
      store.setPollinationsAccount(null);
      return;
    }
    store.setIsLoadingPollinations(true);
    try {
      const [balanceResult, profileResult] = await Promise.all([
        fetchPollinationsBalance(),
        fetchPollinationsProfile(),
      ]);
      if (balanceResult) {
        store.setPollinationsAccount({
          balance: balanceResult.balance,
          tier: profileResult?.tier,
        });
      } else {
        store.setPollinationsAccount(null);
      }
    } finally {
      store.setIsLoadingPollinations(false);
    }
  }, [pollinationsKey, store]);

  const refreshHuggingface = useCallback(async () => {
    if (!hfToken) {
      store.setHuggingfaceAccount(null);
      return;
    }
    store.setIsLoadingHuggingface(true);
    try {
      const result = await fetchHfAccountInfo(hfToken);
      store.setHuggingfaceAccount(result);
    } finally {
      store.setIsLoadingHuggingface(false);
    }
  }, [hfToken, store]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshPollinations(), refreshHuggingface()]);
  }, [refreshPollinations, refreshHuggingface]);

  useEffect(() => {
    if (pollinationsKey) {
      refreshPollinations();
    } else {
      store.setPollinationsAccount(null);
    }
  }, [pollinationsKey]);

  useEffect(() => {
    if (hfToken) {
      refreshHuggingface();
    } else {
      store.setHuggingfaceAccount(null);
    }
  }, [hfToken]);

  return {
    pollinations: store.pollinations,
    huggingface: store.huggingface,
    isLoadingPollinations: store.isLoadingPollinations,
    isLoadingHuggingface: store.isLoadingHuggingface,
    refreshPollinations,
    refreshHuggingface,
    refreshAll,
  };
}
