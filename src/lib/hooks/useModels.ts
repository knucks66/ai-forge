'use client';

import { useEffect, useCallback } from 'react';
import { useModelsStore } from '@/stores/useModelsStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { fetchPollinationsModels } from '@/lib/api/pollinations';
import { fetchHfModels } from '@/lib/api/huggingface';
import { ModelOption } from '@/types/models';
import { defaultImageModels, defaultTextModels, defaultAudioModels, defaultVideoModels } from '@/data/default-models';
import { GenerationType } from '@/types/generation';

/**
 * Hook that auto-fetches models from Pollinations and HuggingFace APIs.
 * Uses TTL-based caching (1 hour) to avoid excessive API calls.
 * Falls back to hardcoded defaults only when APIs are unreachable.
 */
export function useModels() {
  const store = useModelsStore();
  const hfToken = useSettingsStore((s) => s.hfToken);

  const fetchAllModels = useCallback(async () => {
    store.setIsLoading(true);

    try {
      // Fetch from all sources concurrently
      const [
        pollinationsImageModels,
        pollinationsTextModels,
        pollinationsAudioModels,
        hfImageModels,
        hfTextModels,
        hfVideoModels,
      ] = await Promise.allSettled([
        fetchPollinationsModels('image'),
        fetchPollinationsModels('text'),
        fetchPollinationsModels('audio'),
        fetchHfModels('text-to-image', hfToken || undefined),
        fetchHfModels('text-generation', hfToken || undefined),
        fetchHfModels('text-to-video', hfToken || undefined),
      ]);

      // Process image models
      const imageModels: ModelOption[] = [];
      if (pollinationsImageModels.status === 'fulfilled' && pollinationsImageModels.value.length > 0) {
        imageModels.push(
          ...pollinationsImageModels.value.map((id: string) => ({
            id,
            name: formatModelName(id),
            provider: 'pollinations' as const,
            type: 'image' as const,
            tags: [],
          }))
        );
      } else {
        imageModels.push(...defaultImageModels.filter((m) => m.provider === 'pollinations'));
      }
      if (hfImageModels.status === 'fulfilled' && hfImageModels.value.length > 0) {
        imageModels.push(
          ...hfImageModels.value.map((m) => ({
            id: m.id,
            name: m.name || m.id.split('/').pop() || m.id,
            provider: 'huggingface' as const,
            type: 'image' as const,
            description: m.description,
            tags: m.tags as string[] | undefined,
          }))
        );
      } else {
        imageModels.push(...defaultImageModels.filter((m) => m.provider === 'huggingface'));
      }
      store.setImageModels(imageModels);

      // Process text models
      const textModels: ModelOption[] = [];
      if (pollinationsTextModels.status === 'fulfilled' && pollinationsTextModels.value.length > 0) {
        textModels.push(
          ...pollinationsTextModels.value.map((id: string) => ({
            id,
            name: formatModelName(id),
            provider: 'pollinations' as const,
            type: 'text' as const,
            tags: [],
          }))
        );
      } else {
        textModels.push(...defaultTextModels.filter((m) => m.provider === 'pollinations'));
      }
      if (hfTextModels.status === 'fulfilled' && hfTextModels.value.length > 0) {
        textModels.push(
          ...hfTextModels.value.map((m) => ({
            id: m.id,
            name: m.name || m.id.split('/').pop() || m.id,
            provider: 'huggingface' as const,
            type: 'text' as const,
            description: m.description,
            tags: m.tags as string[] | undefined,
          }))
        );
      } else {
        textModels.push(...defaultTextModels.filter((m) => m.provider === 'huggingface'));
      }
      store.setTextModels(textModels);

      // Process audio models
      const audioModels: ModelOption[] = [];
      if (pollinationsAudioModels.status === 'fulfilled' && pollinationsAudioModels.value.length > 0) {
        audioModels.push(
          ...pollinationsAudioModels.value.map((id: string) => ({
            id,
            name: formatModelName(id),
            provider: 'pollinations' as const,
            type: 'audio' as const,
            tags: [],
          }))
        );
      } else {
        audioModels.push(...defaultAudioModels);
      }
      store.setAudioModels(audioModels);

      // Process video models
      const videoModels: ModelOption[] = [];
      if (hfVideoModels.status === 'fulfilled' && hfVideoModels.value.length > 0) {
        videoModels.push(
          ...hfVideoModels.value.map((m) => ({
            id: m.id,
            name: m.name || m.id.split('/').pop() || m.id,
            provider: 'huggingface' as const,
            type: 'video' as const,
            description: m.description,
            tags: m.tags as string[] | undefined,
          }))
        );
      } else {
        videoModels.push(...defaultVideoModels);
      }
      store.setVideoModels(videoModels);

      // Mark all as freshly fetched
      store.setLastFetched('image');
      store.setLastFetched('text');
      store.setLastFetched('audio');
      store.setLastFetched('video');
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      store.setIsLoading(false);
    }
  }, [hfToken, store]);

  // Auto-fetch on mount and when token changes, respecting TTL
  useEffect(() => {
    const anyStale =
      store.isStale('image') ||
      store.isStale('text') ||
      store.isStale('audio') ||
      store.isStale('video');

    if (anyStale) {
      fetchAllModels();
    }
  }, [hfToken]); // Re-fetch when HF token changes

  return {
    imageModels: store.imageModels,
    textModels: store.textModels,
    audioModels: store.audioModels,
    videoModels: store.videoModels,
    isLoading: store.isLoading,
    refresh: fetchAllModels,
  };
}

/** Format raw model IDs into human-readable names */
function formatModelName(id: string): string {
  // Remove common prefixes/suffixes and format
  return id
    .split('/').pop()! // Take last segment after /
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()) // Title case
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}
