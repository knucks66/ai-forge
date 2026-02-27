import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'image' | 'text' | 'audio' | 'video' | 'gallery' | 'compare';

interface AppState {
  activeMode: AppMode;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  setActiveMode: (mode: AppMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeMode: 'image',
      sidebarOpen: true,
      theme: 'dark',
      setActiveMode: (mode) => set({ activeMode: mode }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'ai-forge-app' }
  )
);
