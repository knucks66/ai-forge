'use client';

import { useTextStore } from '@/stores/useTextStore';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, MessageSquareCode } from 'lucide-react';

export function SystemPromptInput() {
  const { systemPrompt, setSystemPrompt, showSystemPrompt, setShowSystemPrompt } = useTextStore();

  return (
    <div className="mb-3">
      <button
        onClick={() => setShowSystemPrompt(!showSystemPrompt)}
        className="flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground transition-colors mb-1"
      >
        <MessageSquareCode className="w-3.5 h-3.5" />
        System Prompt
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showSystemPrompt && 'rotate-180')} />
        {systemPrompt && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
      </button>
      {showSystemPrompt && (
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          rows={2}
          className={cn(
            'w-full px-3 py-2 bg-background border border-border rounded-lg text-xs resize-none',
            'focus:outline-none focus:border-accent animate-fade-in'
          )}
        />
      )}
    </div>
  );
}
