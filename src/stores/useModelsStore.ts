import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModelOption } from '@/types/models';
import { defaultImageModels, defaultTextModels, defaultAudioModels, defaultVideoModels } from '@/data/default-models';

const TTL = 60 * 60 * 1000; // 1 hour

interface ModelsState {
  imageModels: ModelOption[];
  textModels: ModelOption[];
  audioModels: ModelOption[];
  videoModels: ModelOption[];
  lastFetched: Record<string, number>;
  isLoading: boolean;

  setImageModels: (models: ModelOption[]) => void;
  setTextModels: (models: ModelOption[]) => void;
  setAudioModels: (models: ModelOption[]) => void;
  setVideoModels: (models: ModelOption[]) => void;
  setLastFetched: (key: string) => void;
  setIsLoading: (loading: boolean) => void;
  isStale: (key: string) => boolean;
}

export const useModelsStore = create<ModelsState>()(
  persist(
    (set, get) => ({
      imageModels: defaultImageModels,
      textModels: defaultTextModels,
      audioModels: defaultAudioModels,
      videoModels: defaultVideoModels,
      lastFetched: {},
      isLoading: false,

      setImageModels: (models) => set({ imageModels: models }),
      setTextModels: (models) => set({ textModels: models }),
      setAudioModels: (models) => set({ audioModels: models }),
      setVideoModels: (models) => set({ videoModels: models }),
      setLastFetched: (key) => set((s) => ({ lastFetched: { ...s.lastFetched, [key]: Date.now() } })),
      setIsLoading: (loading) => set({ isLoading: loading }),
      isStale: (key) => {
        const last = get().lastFetched[key];
        return !last || Date.now() - last > TTL;
      },
    }),
    {
      name: 'ai-forge-models',
      partialize: (state) => ({
        imageModels: state.imageModels,
        textModels: state.textModels,
        audioModels: state.audioModels,
        videoModels: state.videoModels,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
