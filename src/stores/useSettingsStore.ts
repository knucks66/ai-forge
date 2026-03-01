import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hfToken: string;
  pollinationsKey: string;
  googleApiKey: string;
  nsfwEnabled: boolean;
  setHfToken: (token: string) => void;
  setPollinationsKey: (key: string) => void;
  setGoogleApiKey: (key: string) => void;
  setNsfwEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hfToken: '',
      pollinationsKey: '',
      googleApiKey: '',
      nsfwEnabled: false,
      setHfToken: (token) => set({ hfToken: token }),
      setPollinationsKey: (key) => set({ pollinationsKey: key }),
      setGoogleApiKey: (key) => set({ googleApiKey: key }),
      setNsfwEnabled: (enabled) => set({ nsfwEnabled: enabled }),
    }),
    { name: 'ai-forge-settings' }
  )
);
