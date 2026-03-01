import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoGenerationMode, Provider } from '@/types/generation';

interface VideoState {
  prompt: string;
  model: string;
  provider: Provider;
  mode: VideoGenerationMode;
  inputImageUrl: string | null;
  inputImageBlob: Blob | null;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  audio: boolean;
  isGenerating: boolean;
  videoUrl: string | null;
  videoBlob: Blob | null;
  error: string | null;
  progress: number;

  setPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setProvider: (provider: Provider) => void;
  setMode: (mode: VideoGenerationMode) => void;
  setInputImage: (url: string | null, blob: Blob | null) => void;
  clearInputImage: () => void;
  setDuration: (duration: number) => void;
  setAspectRatio: (ratio: '16:9' | '9:16' | '1:1') => void;
  setAudio: (audio: boolean) => void;
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
      model: 'wan',
      provider: 'pollinations' as const,
      mode: 'text-to-video' as VideoGenerationMode,
      inputImageUrl: null,
      inputImageBlob: null,
      duration: 5,
      aspectRatio: '16:9' as const,
      audio: false,
      isGenerating: false,
      videoUrl: null,
      videoBlob: null,
      error: null,
      progress: 0,

      setPrompt: (prompt) => set({ prompt }),
      setModel: (model) => set({ model }),
      setProvider: (provider) => set({ provider }),
      setMode: (mode) => set({ mode }),
      setInputImage: (url, blob) => set({
        inputImageUrl: url,
        inputImageBlob: blob,
        mode: url ? 'image-to-video' : 'text-to-video',
      }),
      clearInputImage: () => set({
        inputImageUrl: null,
        inputImageBlob: null,
        mode: 'text-to-video',
      }),
      setDuration: (duration) => set({ duration }),
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setAudio: (audio) => set({ audio }),
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
        inputImageUrl: null,
        inputImageBlob: null,
        mode: 'text-to-video',
      }),
    }),
    {
      name: 'ai-forge-video',
      partialize: (state) => ({
        model: state.model,
        provider: state.provider,
        duration: state.duration,
        aspectRatio: state.aspectRatio,
        audio: state.audio,
      }),
    }
  )
);
