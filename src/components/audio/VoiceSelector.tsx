'use client';

import { voices } from '@/data/voices';
import { cn } from '@/lib/utils/cn';
import { User, Users } from 'lucide-react';

interface VoiceSelectorProps {
  selected: string;
  onSelect: (voiceId: string) => void;
}

export function VoiceSelector({ selected, onSelect }: VoiceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted">Voice</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            className={cn(
              'flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all',
              selected === voice.id
                ? 'border-accent bg-accent/10 shadow-sm'
                : 'border-border hover:border-accent/50 hover:bg-surface-hover'
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                voice.gender === 'female' ? 'bg-pink-500/15 text-pink-400' :
                voice.gender === 'male' ? 'bg-blue-500/15 text-blue-400' :
                'bg-purple-500/15 text-purple-400'
              )}>
                {voice.gender === 'neutral' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <span className={cn(
                'text-sm font-medium',
                selected === voice.id ? 'text-accent' : 'text-foreground'
              )}>
                {voice.name}
              </span>
            </div>
            <p className="text-xs text-muted leading-tight">{voice.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
