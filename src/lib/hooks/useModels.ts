'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useModelsStore } from '@/stores/useModelsStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { fetchPollinationsModels } from '@/lib/api/pollinations';
import { fetchHfModels } from '@/lib/api/huggingface';
import { ModelOption } from '@/types/models';
import { defaultImageModels, defaultTextModels, defaultAudioModels, defaultVideoModels } from '@/data/default-models';
import { GenerationType } from '@/types/generation';
import { getPollinationsCapabilities, getHfCapabilities, POLLINATIONS_VIDEO_MODELS } from '@/data/model-capabilities';

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

      // Process image models + separate video models from Pollinations
      const imageModels: ModelOption[] = [];
      const pollinationsVideoModels: ModelOption[] = [];

      if (pollinationsImageModels.status === 'fulfilled' && pollinationsImageModels.value.length > 0) {
        for (const modelInfo of pollinationsImageModels.value) {
          const isVideo = modelInfo.output_modalities?.includes('video') || POLLINATIONS_VIDEO_MODELS.has(modelInfo.id);
          const acceptsImage = modelInfo.input_modalities?.includes('image');
          const caps = getPollinationsCapabilities(modelInfo.id, {
            input_modalities: modelInfo.input_modalities,
            output_modalities: modelInfo.output_modalities,
          });

          // Separate video models from image models
          if (isVideo) {
            pollinationsVideoModels.push({
              id: modelInfo.id,
              name: modelInfo.name || formatModelName(modelInfo.id),
              provider: 'pollinations',
              type: 'video',
              tags: [],
              capabilities: caps,
              paidOnly: modelInfo.paid_only,
              costsCredits: modelInfo.costsCredits,
            });
          } else {
            imageModels.push({
              id: modelInfo.id,
              name: modelInfo.name || formatModelName(modelInfo.id),
              provider: 'pollinations',
              type: 'image',
              tags: [],
              capabilities: Object.keys(caps).length > 0 ? caps : undefined,
              paidOnly: modelInfo.paid_only,
              costsCredits: modelInfo.costsCredits,
            });
          }
        }
      } else {
        imageModels.push(...defaultImageModels.filter((m) => m.provider === 'pollinations'));
      }

      if (hfImageModels.status === 'fulfilled' && hfImageModels.value.length > 0) {
        imageModels.push(
          ...hfImageModels.value.map((m) => {
            const caps = getHfCapabilities(m.id, 'text-to-image');
            return {
              id: m.id,
              name: m.name || m.id.split('/').pop() || m.id,
              provider: 'huggingface' as const,
              type: 'image' as const,
              description: m.description,
              tags: m.tags as string[] | undefined,
              capabilities: Object.keys(caps).length > 0 ? caps : undefined,
            };
          })
        );
      } else {
        imageModels.push(...defaultImageModels.filter((m) => m.provider === 'huggingface'));
      }
      // Google models — static defaults, no API fetch needed
      imageModels.push(...defaultImageModels.filter((m) => m.provider === 'google'));
      store.setImageModels(imageModels);

      // Process text models
      const textModels: ModelOption[] = [];
      if (pollinationsTextModels.status === 'fulfilled' && pollinationsTextModels.value.length > 0) {
        textModels.push(
          ...pollinationsTextModels.value.map((modelInfo) => ({
            id: modelInfo.id,
            name: modelInfo.name || formatModelName(modelInfo.id),
            provider: 'pollinations' as const,
            type: 'text' as const,
            tags: [] as string[],
            paidOnly: modelInfo.paid_only,
            costsCredits: modelInfo.costsCredits,
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
      // Google models — static defaults, no API fetch needed
      textModels.push(...defaultTextModels.filter((m) => m.provider === 'google'));
      store.setTextModels(textModels);

      // Process audio models
      const audioModels: ModelOption[] = [];
      if (pollinationsAudioModels.status === 'fulfilled' && pollinationsAudioModels.value.length > 0) {
        audioModels.push(
          ...pollinationsAudioModels.value.map((modelInfo) => ({
            id: modelInfo.id,
            name: modelInfo.name || formatModelName(modelInfo.id),
            provider: 'pollinations' as const,
            type: 'audio' as const,
            tags: [] as string[],
            paidOnly: modelInfo.paid_only,
            costsCredits: modelInfo.costsCredits,
          }))
        );
      } else {
        audioModels.push(...defaultAudioModels);
      }
      store.setAudioModels(audioModels);

      // Process video models: combine Pollinations video models + HF video models
      const videoModels: ModelOption[] = [];

      // Add Pollinations video models discovered from image API
      if (pollinationsVideoModels.length > 0) {
        videoModels.push(...pollinationsVideoModels);
      } else {
        // Fall back to default Pollinations video models
        videoModels.push(...defaultVideoModels.filter((m) => m.provider === 'pollinations'));
      }

      if (hfVideoModels.status === 'fulfilled' && hfVideoModels.value.length > 0) {
        videoModels.push(
          ...hfVideoModels.value.map((m) => {
            const caps = getHfCapabilities(m.id, 'text-to-video');
            return {
              id: m.id,
              name: m.name || m.id.split('/').pop() || m.id,
              provider: 'huggingface' as const,
              type: 'video' as const,
              description: m.description,
              tags: m.tags as string[] | undefined,
              capabilities: Object.keys(caps).length > 0 ? caps : undefined,
            };
          })
        );
      } else {
        videoModels.push(...defaultVideoModels.filter((m) => m.provider === 'huggingface'));
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

  // Always ensure Google defaults are present (static models, no API fetch needed).
  // This handles the case where cached model lists predate the Google provider.
  const imageModels = useMemo(() => {
    const hasGoogle = store.imageModels.some((m) => m.provider === 'google');
    if (hasGoogle) return store.imageModels;
    return [...store.imageModels, ...defaultImageModels.filter((m) => m.provider === 'google')];
  }, [store.imageModels]);

  const textModels = useMemo(() => {
    const hasGoogle = store.textModels.some((m) => m.provider === 'google');
    if (hasGoogle) return store.textModels;
    return [...store.textModels, ...defaultTextModels.filter((m) => m.provider === 'google')];
  }, [store.textModels]);

  return {
    imageModels,
    textModels,
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
