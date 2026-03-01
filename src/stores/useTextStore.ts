import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types/chat';
import { Provider } from '@/types/generation';

interface TextState {
  messages: ChatMessage[];
  systemPrompt: string;
  model: string;
  provider: Provider;
  temperature: number;
  maxTokens: number;
  topP: number;
  isGenerating: boolean;
  error: string | null;
  showSystemPrompt: boolean;

  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setProvider: (provider: Provider) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTopP: (topP: number) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  setShowSystemPrompt: (show: boolean) => void;
}

export const useTextStore = create<TextState>()(
  persist(
    (set) => ({
      messages: [],
      systemPrompt: '',
      model: 'openai',
      provider: 'pollinations',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      isGenerating: false,
      error: null,
      showSystemPrompt: false,

      addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
      updateLastAssistantMessage: (content) =>
        set((s) => {
          const msgs = [...s.messages];
          const lastIdx = msgs.findLastIndex((m) => m.role === 'assistant');
          if (lastIdx >= 0) {
            msgs[lastIdx] = { ...msgs[lastIdx], content };
          }
          return { messages: msgs };
        }),
      clearMessages: () => set({ messages: [] }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setModel: (model) => set({ model }),
      setProvider: (provider) => set({ provider }),
      setTemperature: (temp) => set({ temperature: temp }),
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
      setTopP: (topP) => set({ topP }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setError: (error) => set({ error }),
      setShowSystemPrompt: (show) => set({ showSystemPrompt: show }),
    }),
    {
      name: 'ai-forge-text',
      partialize: (state) => ({
        systemPrompt: state.systemPrompt,
        model: state.model,
        provider: state.provider,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        topP: state.topP,
        showSystemPrompt: state.showSystemPrompt,
      }),
    }
  )
);
