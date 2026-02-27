'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Sun, Moon, Settings, Sparkles } from 'lucide-react';
import { SettingsDialog } from '@/components/settings/SettingsDialog';

export function Header() {
  const { theme, toggleTheme, activeMode } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);

  const modeLabels: Record<string, string> = {
    image: 'Image Generation',
    text: 'Text Chat',
    audio: 'Audio Generation',
    video: 'Video Generation',
    gallery: 'Gallery',
    compare: 'Compare',
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-surface/50 backdrop-blur-sm">
        {/* Mode title - visible on mobile too */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-lg font-semibold">{modeLabels[activeMode] || 'AI Forge'}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showSettings && <SettingsDialog onClose={() => setShowSettings(false)} />}
    </>
  );
}
