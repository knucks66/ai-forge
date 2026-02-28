'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { stylePresets, styleCategories, StyleCategory } from '@/data/style-presets';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils/cn';
import { Search, X, ChevronDown } from 'lucide-react';

interface StylePresetPickerProps {
  selected: string;
  onSelect: (presetId: string) => void;
}

export function StylePresetPicker({ selected, onSelect }: StylePresetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const nsfwEnabled = useSettingsStore((s) => s.nsfwEnabled);

  const visiblePresets = useMemo(
    () => nsfwEnabled ? stylePresets : stylePresets.filter((p) => !p.nsfw),
    [nsfwEnabled]
  );

  const visibleCategories = useMemo(
    () => nsfwEnabled
      ? styleCategories.filter((c) => c.id !== 'none')
      : styleCategories.filter((c) => c.id !== 'nsfw' && c.id !== 'none'),
    [nsfwEnabled]
  );

  const selectedPreset = useMemo(
    () => stylePresets.find((p) => p.id === selected),
    [selected]
  );

  const isSearching = searchQuery.trim().length > 0;

  const filteredPresets = useMemo(() => {
    if (!isSearching) return visiblePresets;
    const query = searchQuery.toLowerCase();
    return visiblePresets.filter((p) => p.name.toLowerCase().includes(query));
  }, [visiblePresets, searchQuery, isSearching]);

  const presetsByCategory = useMemo(() => {
    const map = new Map<StyleCategory, typeof visiblePresets>();
    for (const cat of visibleCategories) {
      const catPresets = visiblePresets.filter((p) => p.category === cat.id);
      if (catPresets.length > 0) {
        map.set(cat.id, catPresets);
      }
    }
    return map;
  }, [visiblePresets, visibleCategories]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  function handleSelect(presetId: string) {
    onSelect(presetId);
    setIsOpen(false);
  }

  const noStylePreset = stylePresets.find((p) => p.id === 'none');

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <label className="text-xs font-medium text-muted">Style Preset</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-left cursor-pointer',
          'focus:outline-none focus:border-accent flex items-center gap-2'
        )}
      >
        {selectedPreset ? (
          <>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedPreset.color }}
            />
            <span className="flex-1 truncate">{selectedPreset.name}</span>
          </>
        ) : (
          <span className="flex-1 truncate text-muted">No Style</span>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-muted shrink-0 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 w-[calc(100%-2rem)] mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto animate-fade-in">
          {/* Search bar (sticky) */}
          <div className="sticky top-0 z-10 bg-surface p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                ref={searchInputRef}
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
          </div>

          {/* "No Style" option — always visible at top */}
          {noStylePreset && (!isSearching || noStylePreset.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
            <button
              onClick={() => handleSelect('none')}
              className={cn(
                'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 transition-colors',
                selected === 'none'
                  ? 'bg-accent/15 text-accent'
                  : 'hover:bg-surface-hover text-foreground'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: noStylePreset.color }}
              />
              <span className="flex-1 truncate">{noStylePreset.name}</span>
            </button>
          )}

          {isSearching ? (
            /* Flat filtered results (no category headers) */
            filteredPresets.filter((p) => p.id !== 'none').length > 0 ? (
              filteredPresets.filter((p) => p.id !== 'none').map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelect(preset.id)}
                  className={cn(
                    'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 transition-colors',
                    selected === preset.id
                      ? 'bg-accent/15 text-accent'
                      : 'hover:bg-surface-hover text-foreground'
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="flex-1 truncate">{preset.name}</span>
                  {preset.suggestedCfg && (
                    <span className="text-[9px] font-medium text-muted shrink-0">
                      CFG {preset.suggestedCfg}
                    </span>
                  )}
                </button>
              ))
            ) : (
              !noStylePreset?.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div className="px-3 py-4 text-center text-xs text-muted">
                  No styles match &quot;{searchQuery}&quot;
                </div>
              )
            )
          ) : (
            /* Category-grouped list */
            visibleCategories.map((cat) => {
              const catPresets = presetsByCategory.get(cat.id);
              if (!catPresets || catPresets.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="sticky top-[52px] px-3 py-1.5 bg-surface border-b border-border flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted">
                      {catPresets.length}
                    </span>
                  </div>
                  {catPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelect(preset.id)}
                      className={cn(
                        'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 transition-colors',
                        selected === preset.id
                          ? 'bg-accent/15 text-accent'
                          : 'hover:bg-surface-hover text-foreground'
                      )}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="flex-1 truncate">{preset.name}</span>
                      {preset.suggestedCfg && (
                        <span className="text-[9px] font-medium text-muted shrink-0">
                          CFG {preset.suggestedCfg}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
