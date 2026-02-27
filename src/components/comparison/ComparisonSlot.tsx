'use client';

import { ModelSelector } from '@/components/shared/ModelSelector';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';
import { GenerationType, Provider } from '@/types/generation';

interface ComparisonSlotProps {
  label: string;
  mode: GenerationType;
  model: string;
  provider: Provider;
  onModelChange: (model: string, provider: Provider) => void;
  isGenerating: boolean;
  resultUrl: string | null;
  textContent: string;
  error: string | null;
}

export function ComparisonSlot({
  label,
  mode,
  model,
  provider,
  onModelChange,
  isGenerating,
  resultUrl,
  textContent,
  error,
}: ComparisonSlotProps) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-accent">{label}</span>
      </div>

      <ModelSelector
        type={mode === 'audio' ? 'audio' : mode}
        selectedModel={model}
        selectedProvider={provider}
        onSelect={onModelChange}
      />

      {/* Result area */}
      <div className={cn(
        'flex items-center justify-center rounded-lg bg-surface min-h-[250px] overflow-hidden',
        isGenerating && 'animate-pulse'
      )}>
        {isGenerating ? (
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
            <p className="text-xs text-muted">Generating...</p>
          </div>
        ) : error ? (
          <div className="p-3 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : resultUrl && mode === 'image' ? (
          <img src={resultUrl} alt="" className="max-w-full max-h-[400px] object-contain rounded-lg" />
        ) : textContent ? (
          <div className="w-full p-3 text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {textContent}
          </div>
        ) : (
          <p className="text-xs text-muted">Result will appear here</p>
        )}
      </div>
    </div>
  );
}
