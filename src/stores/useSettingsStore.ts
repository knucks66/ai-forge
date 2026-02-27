import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hfToken: string;
  pollinationsKey: string;
  setHfToken: (token: string) => void;
  setPollinationsKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hfToken: '',
      pollinationsKey: '',
      setHfToken: (token) => set({ hfToken: token }),
      setPollinationsKey: (key) => set({ pollinationsKey: key }),
    }),
    { name: 'ai-forge-settings' }
  )
);
