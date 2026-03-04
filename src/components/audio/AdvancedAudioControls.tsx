'use client';

import { useAudioStore } from '@/stores/useAudioStore';
import { AudioFormat } from '@/types/generation';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

const FORMAT_OPTIONS: { value: AudioFormat; label: string }[] = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'flac', label: 'FLAC' },
  { value: 'opus', label: 'OPUS' },
  { value: 'aac', label: 'AAC' },
];

export function AdvancedAudioControls() {
  const store = useAudioStore();

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => store.setShowAdvanced(!store.showAdvanced)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-muted hover:text-foreground transition-colors"
      >
        <span>Advanced Settings</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform',
            store.showAdvanced && 'rotate-180'
          )}
        />
      </button>

      {store.showAdvanced && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted">Output Format</label>
            <select
              value={store.format}
              onChange={(e) => store.setFormat(e.target.value as AudioFormat)}
              className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs appearance-none focus:outline-none focus:border-accent cursor-pointer"
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
