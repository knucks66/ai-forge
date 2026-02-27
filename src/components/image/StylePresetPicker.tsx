'use client';

import { useState } from 'react';
import { stylePresets, styleCategories, StyleCategory } from '@/data/style-presets';
import { cn } from '@/lib/utils/cn';

interface StylePresetPickerProps {
  selected: string;
  onSelect: (presetId: string) => void;
}

export function StylePresetPicker({ selected, onSelect }: StylePresetPickerProps) {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('none');

  const filteredPresets = activeCategory === 'none'
    ? stylePresets
    : stylePresets.filter((p) => p.category === activeCategory || p.category === 'none');

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted">Style Preset</label>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {styleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
              activeCategory === cat.id
                ? 'bg-accent/15 text-accent'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
        {filteredPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className={cn(
              'px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all border',
              selected === preset.id
                ? 'border-accent bg-accent/15 text-accent shadow-sm'
                : 'border-border text-muted hover:border-accent/50 hover:text-foreground'
            )}
            title={preset.promptPrefix ? `${preset.promptPrefix} [prompt] ${preset.promptSuffix}` : 'No style modifications'}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mx-auto mb-1"
              style={{ backgroundColor: preset.color }}
            />
            <span className="leading-tight block truncate">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
