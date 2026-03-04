'use client';

import { getVoicesForModel } from '@/data/voices';

interface VoiceSelectorProps {
  selected: string;
  onSelect: (voiceId: string) => void;
  modelId: string;
  disabled?: boolean;
}

export function VoiceSelector({ selected, onSelect, modelId, disabled }: VoiceSelectorProps) {
  const availableVoices = getVoicesForModel(modelId);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted">Voice</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:border-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {availableVoices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} — {voice.description} ({voice.gender})
          </option>
        ))}
      </select>
      <p className="text-[10px] text-muted">{availableVoices.length} voices available</p>
    </div>
  );
}
