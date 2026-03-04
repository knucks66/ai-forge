import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AudioGenerationMode, AudioFormat } from '@/types/generation';
import { Provider } from '@/types/generation';

interface AudioState {
  text: string;
  voice: string;
  model: string;
  mode: AudioGenerationMode;
  provider: Provider;
  format: AudioFormat;
  duration: number;
  genreTags: string[];
  showAdvanced: boolean;
  progress: number;
  isGenerating: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  error: string | null;

  setText: (text: string) => void;
  setVoice: (voice: string) => void;
  setModel: (model: string) => void;
  setMode: (mode: AudioGenerationMode) => void;
  setProvider: (provider: Provider) => void;
  setFormat: (format: AudioFormat) => void;
  setDuration: (duration: number) => void;
  setGenreTags: (tags: string[]) => void;
  toggleGenreTag: (tag: string) => void;
  setShowAdvanced: (show: boolean) => void;
  setProgress: (progress: number) => void;
  setIsGenerating: (generating: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  setAudioBlob: (blob: Blob | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      text: '',
      voice: 'alloy',
      model: 'openai-audio',
      mode: 'tts',
      provider: 'pollinations',
      format: 'mp3',
      duration: 30,
      genreTags: [],
      showAdvanced: false,
      progress: 0,
      isGenerating: false,
      audioUrl: null,
      audioBlob: null,
      error: null,

      setText: (text) => set({ text }),
      setVoice: (voice) => set({ voice }),
      setModel: (model) => set({ model }),
      setMode: (mode) => set({ mode }),
      setProvider: (provider) => set({ provider }),
      setFormat: (format) => set({ format }),
      setDuration: (duration) => set({ duration }),
      setGenreTags: (tags) => set({ genreTags: tags }),
      toggleGenreTag: (tag) => {
        const current = get().genreTags;
        set({
          genreTags: current.includes(tag)
            ? current.filter((t) => t !== tag)
            : [...current, tag],
        });
      },
      setShowAdvanced: (show) => set({ showAdvanced: show }),
      setProgress: (progress) => set({ progress }),
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
        progress: 0,
      }),
    }),
    {
      name: 'ai-forge-audio',
      partialize: (state) => ({
        voice: state.voice,
        model: state.model,
        mode: state.mode,
        format: state.format,
        duration: state.duration,
        genreTags: state.genreTags,
        showAdvanced: state.showAdvanced,
      }),
    }
  )
);
