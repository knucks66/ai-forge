'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showEnhance?: boolean;
  rows?: number;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Describe what you want to create...',
  disabled = false,
  showEnhance = true,
  rows = 3,
}: PromptInputProps) {
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!value.trim()) {
      toast.error('Enter a prompt first');
      return;
    }
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: value, type: 'image' }),
      });
      const data = await res.json();
      if (data.enhanced) {
        onChange(data.enhanced);
        toast.success('Prompt enhanced!');
      } else {
        toast.error(data.error || 'Enhancement failed');
      }
    } catch {
      toast.error('Failed to enhance prompt');
    } finally {
      setEnhancing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50',
          'placeholder:text-muted/60 transition-colors',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      {showEnhance && (
        <button
          onClick={handleEnhance}
          disabled={enhancing || disabled || !value.trim()}
          className={cn(
            'absolute right-2 bottom-2 p-2 rounded-lg transition-all',
            'text-accent hover:bg-accent/15 disabled:opacity-40 disabled:cursor-not-allowed',
            enhancing && 'animate-pulse'
          )}
          title="Enhance prompt with AI"
        >
          {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
