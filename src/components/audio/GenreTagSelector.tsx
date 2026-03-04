'use client';

import { genreTags, moodTags } from '@/data/audio-genres';
import { cn } from '@/lib/utils/cn';

interface GenreTagSelectorProps {
  selected: string[];
  onToggle: (tag: string) => void;
  disabled?: boolean;
}

export function GenreTagSelector({ selected, onToggle, disabled }: GenreTagSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Genre</label>
        <div className="flex flex-wrap gap-1.5">
          {genreTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              disabled={disabled}
              className={cn(
                'px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors',
                selected.includes(tag.id)
                  ? 'bg-accent/15 text-accent border-accent/50'
                  : 'border-border text-muted hover:border-accent/30 hover:text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Mood</label>
        <div className="flex flex-wrap gap-1.5">
          {moodTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              disabled={disabled}
              className={cn(
                'px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors',
                selected.includes(tag.id)
                  ? 'bg-accent/15 text-accent border-accent/50'
                  : 'border-border text-muted hover:border-accent/30 hover:text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
