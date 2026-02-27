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
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';

const navItems: { mode: AppMode; icon: React.ElementType; label: string }[] = [
  { mode: 'image', icon: Image, label: 'Image' },
  { mode: 'text', icon: MessageSquare, label: 'Text' },
  { mode: 'audio', icon: Music, label: 'Audio' },
  { mode: 'video', icon: Video, label: 'Video' },
  { mode: 'gallery', icon: Grid3X3, label: 'Gallery' },
  { mode: 'compare', icon: GitCompareArrows, label: 'Compare' },
];

export function Sidebar() {
  const { activeMode, setActiveMode, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-surface border-r border-border transition-all duration-200',
        sidebarOpen ? 'w-56' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2 p-4 border-b border-border',
        !sidebarOpen && 'justify-center'
      )}>
        <Sparkles className="w-6 h-6 text-accent shrink-0" />
        {sidebarOpen && (
          <span className="font-bold text-lg bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            AI Forge
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              activeMode === mode
                ? 'bg-accent/15 text-accent'
                : 'text-muted hover:text-foreground hover:bg-surface-hover',
              !sidebarOpen && 'justify-center px-0'
            )}
            title={label}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center gap-2 p-3 border-t border-border text-muted hover:text-foreground transition-colors"
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <>
            <PanelLeftClose className="w-5 h-5" />
            <span className="text-sm">Collapse</span>
          </>
        ) : (
          <PanelLeftOpen className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
