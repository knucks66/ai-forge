import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/stores/useAppStore';

const { getState, setState } = useAppStore;

const initialState = {
  activeMode: 'image' as const,
  sidebarOpen: true,
  theme: 'dark' as const,
};

beforeEach(() => {
  setState(initialState);
});

describe('useAppStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      expect(getState().activeMode).toBe('image');
      expect(getState().sidebarOpen).toBe(true);
      expect(getState().theme).toBe('dark');
    });
  });

  describe('setActiveMode', () => {
    it('sets the active mode', () => {
      getState().setActiveMode('text');
      expect(getState().activeMode).toBe('text');
    });

    it('sets all valid modes', () => {
      const modes = ['image', 'text', 'audio', 'video', 'gallery', 'compare'] as const;
      for (const mode of modes) {
        getState().setActiveMode(mode);
        expect(getState().activeMode).toBe(mode);
      }
    });
  });

  describe('toggleSidebar', () => {
    it('toggles sidebar from open to closed', () => {
      expect(getState().sidebarOpen).toBe(true);
      getState().toggleSidebar();
      expect(getState().sidebarOpen).toBe(false);
    });

    it('toggles sidebar from closed to open', () => {
      setState({ sidebarOpen: false });
      getState().toggleSidebar();
      expect(getState().sidebarOpen).toBe(true);
    });
  });

  describe('setSidebarOpen', () => {
    it('sets sidebar open state directly', () => {
      getState().setSidebarOpen(false);
      expect(getState().sidebarOpen).toBe(false);
      getState().setSidebarOpen(true);
      expect(getState().sidebarOpen).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('sets theme directly', () => {
      getState().setTheme('light');
      expect(getState().theme).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from dark to light', () => {
      expect(getState().theme).toBe('dark');
      getState().toggleTheme();
      expect(getState().theme).toBe('light');
    });

    it('toggles from light to dark', () => {
      setState({ theme: 'light' });
      getState().toggleTheme();
      expect(getState().theme).toBe('dark');
    });
  });
});
