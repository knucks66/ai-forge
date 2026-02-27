import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoState {
  prompt: string;
  model: string;
  provider: 'huggingface';
  isGenerating: boolean;
  videoUrl: string | null;
  videoBlob: Blob | null;
  error: string | null;
  progress: number;

  setPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setVideoUrl: (url: string | null) => void;
  setVideoBlob: (blob: Blob | null) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      prompt: '',
      model: 'ali-vilab/text-to-video-ms-1.7b',
      provider: 'huggingface',
      isGenerating: false,
      videoUrl: null,
      videoBlob: null,
      error: null,
      progress: 0,

      setPrompt: (prompt) => set({ prompt }),
      setModel: (model) => set({ model }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setVideoUrl: (url) => set({ videoUrl: url }),
      setVideoBlob: (blob) => set({ videoBlob: blob }),
      setError: (error) => set({ error }),
      setProgress: (progress) => set({ progress }),
      reset: () => set({
        prompt: '',
        videoUrl: null,
        videoBlob: null,
        error: null,
        isGenerating: false,
        progress: 0,
      }),
    }),
    {
      name: 'ai-forge-video',
      partialize: (state) => ({
        model: state.model,
      }),
    }
  )
);
