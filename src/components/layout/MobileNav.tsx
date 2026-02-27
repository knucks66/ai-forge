'use client';

import { useAppStore, AppMode } from '@/stores/useAppStore';
import { cn } from '@/lib/utils/cn';
import {
  Image,
  MessageSquare,
  Music,
  Video,
  Grid3X3,
  GitCompareArrows,
} from 'lucide-react';

const navItems: { mode: AppMode; icon: React.ElementType; label: string }[] = [
  { mode: 'image', icon: Image, label: 'Image' },
  { mode: 'text', icon: MessageSquare, label: 'Text' },
  { mode: 'audio', icon: Music, label: 'Audio' },
  { mode: 'video', icon: Video, label: 'Video' },
  { mode: 'gallery', icon: Grid3X3, label: 'Gallery' },
  { mode: 'compare', icon: GitCompareArrows, label: 'Compare' },
];

export function MobileNav() {
  const { activeMode, setActiveMode } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors min-w-[48px]',
              activeMode === mode
                ? 'text-accent'
                : 'text-muted'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
