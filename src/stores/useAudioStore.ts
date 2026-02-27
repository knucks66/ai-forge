import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  text: string;
  voice: string;
  model: string;
  isGenerating: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  error: string | null;

  setText: (text: string) => void;
  setVoice: (voice: string) => void;
  setModel: (model: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  setAudioBlob: (blob: Blob | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      text: '',
      voice: 'alloy',
      model: 'openai-audio',
      isGenerating: false,
      audioUrl: null,
      audioBlob: null,
      error: null,

      setText: (text) => set({ text }),
      setVoice: (voice) => set({ voice }),
      setModel: (model) => set({ model }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setAudioUrl: (url) => set({ audioUrl: url }),
      setAudioBlob: (blob) => set({ audioBlob: blob }),
      setError: (error) => set({ error }),
      reset: () => set({
        text: '',
        audioUrl: null,
        audioBlob: null,
        error: null,
        isGenerating: false,
      }),
    }),
    {
      name: 'ai-forge-audio',
      partialize: (state) => ({
        voice: state.voice,
        model: state.model,
      }),
    }
  )
);
