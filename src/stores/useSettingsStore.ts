import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hfToken: string;
  pollinationsKey: string;
  googleApiKey: string;
  groqApiKey: string;
  openRouterApiKey: string;
  nsfwEnabled: boolean;
  setHfToken: (token: string) => void;
  setPollinationsKey: (key: string) => void;
  setGoogleApiKey: (key: string) => void;
  setGroqApiKey: (key: string) => void;
  setOpenRouterApiKey: (key: string) => void;
  setNsfwEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hfToken: '',
      pollinationsKey: '',
      googleApiKey: '',
      groqApiKey: '',
      openRouterApiKey: '',
      nsfwEnabled: false,
      setHfToken: (token) => set({ hfToken: token }),
      setPollinationsKey: (key) => set({ pollinationsKey: key }),
      setGoogleApiKey: (key) => set({ googleApiKey: key }),
      setGroqApiKey: (key) => set({ groqApiKey: key }),
      setOpenRouterApiKey: (key) => set({ openRouterApiKey: key }),
      setNsfwEnabled: (enabled) => set({ nsfwEnabled: enabled }),
    }),
    { name: 'ai-forge-settings' }
  )
);
