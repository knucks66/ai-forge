'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 pt-3 border-t border-border mt-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none',
          'focus:outline-none focus:border-accent',
          'placeholder:text-muted/60 transition-colors',
          disabled && 'opacity-50'
        )}
        style={{ minHeight: '48px', maxHeight: '120px' }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 120) + 'px';
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className={cn(
          'p-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors self-end',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
