import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImageState {
  prompt: string;
  negativePrompt: string;
  model: string;
  provider: 'pollinations' | 'huggingface';
  stylePreset: string;
  canvasSize: string;
  width: number;
  height: number;
  cfgScale: number;
  steps: number;
  sampler: string;
  seed: number;
  useRandomSeed: boolean;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  generatedImageBlob: Blob | null;
  error: string | null;
  showAdvanced: boolean;

  setPrompt: (prompt: string) => void;
  setNegativePrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setProvider: (provider: 'pollinations' | 'huggingface') => void;
  setStylePreset: (preset: string) => void;
  setCanvasSize: (size: string) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setCfgScale: (cfg: number) => void;
  setSteps: (steps: number) => void;
  setSampler: (sampler: string) => void;
  setSeed: (seed: number) => void;
  setUseRandomSeed: (use: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedImageUrl: (url: string | null) => void;
  setGeneratedImageBlob: (blob: Blob | null) => void;
  setError: (error: string | null) => void;
  setShowAdvanced: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  prompt: '',
  negativePrompt: '',
  model: 'flux',
  provider: 'pollinations' as const,
  stylePreset: 'none',
  canvasSize: 'square',
  width: 512,
  height: 512,
  cfgScale: 7,
  steps: 30,
  sampler: 'euler_a',
  seed: -1,
  useRandomSeed: true,
  isGenerating: false,
  generatedImageUrl: null,
  generatedImageBlob: null,
  error: null,
  showAdvanced: false,
};

export const useImageStore = create<ImageState>()(
  persist(
    (set) => ({
      ...initialState,
      setPrompt: (prompt) => set({ prompt }),
      setNegativePrompt: (prompt) => set({ negativePrompt: prompt }),
      setModel: (model) => set({ model }),
      setProvider: (provider) => set({ provider }),
      setStylePreset: (preset) => set({ stylePreset: preset }),
      setCanvasSize: (size) => set({ canvasSize: size }),
      setWidth: (width) => set({ width }),
      setHeight: (height) => set({ height }),
      setCfgScale: (cfg) => set({ cfgScale: cfg }),
      setSteps: (steps) => set({ steps }),
      setSampler: (sampler) => set({ sampler }),
      setSeed: (seed) => set({ seed }),
      setUseRandomSeed: (use) => set({ useRandomSeed: use }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setGeneratedImageUrl: (url) => set({ generatedImageUrl: url }),
      setGeneratedImageBlob: (blob) => set({ generatedImageBlob: blob }),
      setError: (error) => set({ error }),
      setShowAdvanced: (show) => set({ showAdvanced: show }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: 'ai-forge-image',
      partialize: (state) => ({
        model: state.model,
        provider: state.provider,
        stylePreset: state.stylePreset,
        canvasSize: state.canvasSize,
        width: state.width,
        height: state.height,
        cfgScale: state.cfgScale,
        steps: state.steps,
        sampler: state.sampler,
        useRandomSeed: state.useRandomSeed,
        showAdvanced: state.showAdvanced,
      }),
    }
  )
);
