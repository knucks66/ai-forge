'use client';

import { useState, useMemo } from 'react';
import { stylePresets, styleCategories, StyleCategory } from '@/data/style-presets';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils/cn';
import { Search, X } from 'lucide-react';

interface StylePresetPickerProps {
  selected: string;
  onSelect: (presetId: string) => void;
}

export function StylePresetPicker({ selected, onSelect }: StylePresetPickerProps) {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const nsfwEnabled = useSettingsStore((s) => s.nsfwEnabled);

  const visiblePresets = useMemo(
    () => nsfwEnabled ? stylePresets : stylePresets.filter((p) => !p.nsfw),
    [nsfwEnabled]
  );

  const visibleCategories = useMemo(
    () => nsfwEnabled ? styleCategories : styleCategories.filter((c) => c.id !== 'nsfw'),
    [nsfwEnabled]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of styleCategories) {
      counts[cat.id] = visiblePresets.filter(
        (p) => cat.id === 'none' ? true : p.category === cat.id
      ).length;
    }
    return counts;
  }, [visiblePresets]);

  const filteredPresets = useMemo(() => {
    let presets = activeCategory === 'none'
      ? visiblePresets
      : visiblePresets.filter((p) => p.category === activeCategory || p.category === 'none');

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      presets = presets.filter((p) => p.name.toLowerCase().includes(query));
    }

    return presets;
  }, [activeCategory, visiblePresets, searchQuery]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted">Style Preset</label>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {visibleCategories.map((cat) => (
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
            <span className="ml-1 opacity-60">({categoryCounts[cat.id] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search styles..."
          className="w-full pl-8 pr-8 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:border-accent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-52 overflow-y-auto">
        {filteredPresets.length > 0 ? (
          filteredPresets.map((preset) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-4 text-xs text-muted">
            No styles match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
