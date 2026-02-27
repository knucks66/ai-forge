'use client';

import { cn } from '@/lib/utils/cn';
import { Loader2, Zap } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

export function GenerateButton({
  onClick,
  isGenerating,
  disabled = false,
  label = 'Generate',
  loadingLabel = 'Generating...',
  className,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating || disabled}
      className={cn(
        'flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-sm transition-all',
        'bg-accent text-white hover:bg-accent-hover',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isGenerating && 'animate-pulse-glow',
        className
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Zap className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}
