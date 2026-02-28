import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageGenerationMode } from '@/types/generation';

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
  mode: ImageGenerationMode;
  inputImageUrl: string | null;
  inputImageBlob: Blob | null;
  strength: number;
  nsfwDetected: boolean;
  nsfwRevealed: boolean;

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
  setMode: (mode: ImageGenerationMode) => void;
  setInputImage: (url: string | null, blob: Blob | null) => void;
  setStrength: (strength: number) => void;
  clearInputImage: () => void;
  refineCurrentImage: () => void;
  setNsfwDetected: (detected: boolean) => void;
  setNsfwRevealed: (revealed: boolean) => void;
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
  mode: 'text-to-image' as ImageGenerationMode,
  inputImageUrl: null as string | null,
  inputImageBlob: null as Blob | null,
  strength: 0.75,
  nsfwDetected: false,
  nsfwRevealed: false,
};

export const useImageStore = create<ImageState>()(
  persist(
    (set, get) => ({
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
      setMode: (mode) => set({ mode }),
      setInputImage: (url, blob) => set({
        inputImageUrl: url,
        inputImageBlob: blob,
        mode: url ? 'image-to-image' : 'text-to-image',
      }),
      setStrength: (strength) => set({ strength }),
      clearInputImage: () => set({
        inputImageUrl: null,
        inputImageBlob: null,
        mode: 'text-to-image',
      }),
      setNsfwDetected: (detected) => set({ nsfwDetected: detected }),
      setNsfwRevealed: (revealed) => set({ nsfwRevealed: revealed }),
      refineCurrentImage: () => {
        const state = get();
        if (state.generatedImageUrl && state.generatedImageBlob) {
          set({
            inputImageUrl: state.generatedImageUrl,
            inputImageBlob: state.generatedImageBlob,
            generatedImageUrl: null,
            generatedImageBlob: null,
            mode: 'image-to-image',
          });
        }
      },
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
        strength: state.strength,
      }),
    }
  )
);
