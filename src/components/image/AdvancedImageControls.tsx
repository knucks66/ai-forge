'use client';

import { useMemo } from 'react';
import { useImageStore } from '@/stores/useImageStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { SliderControl } from '@/components/shared/SliderControl';
import { samplers } from '@/data/samplers';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, Shuffle } from 'lucide-react';
import { randomSeed } from '@/lib/utils/seed';

const negativeSnippets = [
  { label: 'blurry', value: 'blurry' },
  { label: 'watermark', value: 'watermark, text, signature' },
  { label: 'low quality', value: 'low quality, jpeg artifacts, pixelated' },
  { label: 'bad hands', value: 'deformed hands, extra fingers, mutated hands, bad anatomy' },
  { label: 'bad face', value: 'deformed face, ugly, disfigured' },
  { label: 'duplicate', value: 'duplicate, clone, copy' },
  { label: 'cropped', value: 'cropped, out of frame, cut off' },
  { label: 'nsfw', value: 'nsfw, nude, explicit' },
];

export function AdvancedImageControls() {
  const store = useImageStore();
  const { nsfwEnabled, setNsfwEnabled } = useSettingsStore();

  const activeSnippets = useMemo(() => {
    const current = store.negativePrompt.toLowerCase();
    return negativeSnippets.map((s) => ({
      ...s,
      active: s.value.split(', ').some((term) => current.includes(term.toLowerCase())),
    }));
  }, [store.negativePrompt]);

  const toggleSnippet = (snippet: (typeof negativeSnippets)[number]) => {
    const current = store.negativePrompt;
    const terms = snippet.value.split(', ');
    const isActive = terms.some((term) => current.toLowerCase().includes(term.toLowerCase()));

    if (isActive) {
      // Remove snippet terms from negative prompt
      let updated = current;
      for (const term of terms) {
        const regex = new RegExp(`(,\\s*)?${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*,)?`, 'gi');
        updated = updated.replace(regex, (match, before, after) => {
          if (before && after) return ', ';
          return '';
        });
      }
      store.setNegativePrompt(updated.replace(/^,\s*|,\s*$/g, '').trim());
    } else {
      // Append snippet terms
      const newValue = current ? `${current}, ${snippet.value}` : snippet.value;
      store.setNegativePrompt(newValue);
    }
  };

  const isNsfwSnippetLocked = !nsfwEnabled;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => store.setShowAdvanced(!store.showAdvanced)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        Advanced Settings
        <ChevronDown className={cn('w-4 h-4 transition-transform', store.showAdvanced && 'rotate-180')} />
      </button>

      {store.showAdvanced && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {/* Negative Prompt */}
          <div>
            <label className="text-xs font-medium text-muted mb-1 block">Negative Prompt</label>
            <textarea
              value={store.negativePrompt}
              onChange={(e) => store.setNegativePrompt(e.target.value)}
              placeholder="What to avoid in the image..."
              rows={2}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs resize-none focus:outline-none focus:border-accent"
            />
            {/* Negative prompt snippets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {activeSnippets.map((snippet) => {
                const locked = snippet.label === 'nsfw' && isNsfwSnippetLocked;
                return (
                  <button
                    key={snippet.label}
                    onClick={() => {
                      if (locked) return;
                      toggleSnippet(snippet);
                    }}
                    disabled={locked}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors',
                      snippet.active || locked
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border text-muted hover:border-accent/30 hover:text-foreground',
                      locked && 'opacity-70 cursor-not-allowed'
                    )}
                    title={locked ? 'Auto-active in PG-13 mode' : snippet.value}
                  >
                    {snippet.active || locked ? '−' : '+'} {snippet.label}
                    {locked && ' 🔒'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CFG Scale */}
          <SliderControl
            label="CFG Scale"
            value={store.cfgScale}
            onChange={store.setCfgScale}
            min={1}
            max={30}
            step={0.5}
          />

          {/* Steps */}
          <SliderControl
            label="Steps"
            value={store.steps}
            onChange={store.setSteps}
            min={1}
            max={100}
          />

          {/* Sampler */}
          <div>
            <label className="text-xs font-medium text-muted mb-1 block">Sampler</label>
            <select
              value={store.sampler}
              onChange={(e) => store.setSampler(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs appearance-none focus:outline-none focus:border-accent"
            >
              {samplers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.description}
                </option>
              ))}
            </select>
          </div>

          {/* Seed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-muted">Seed</label>
              <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={store.useRandomSeed}
                  onChange={(e) => store.setUseRandomSeed(e.target.checked)}
                  className="w-3 h-3 accent-accent"
                />
                Random
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={store.seed}
                onChange={(e) => store.setSeed(Number(e.target.value))}
                disabled={store.useRandomSeed}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-accent disabled:opacity-50"
              />
              <button
                onClick={() => store.setSeed(randomSeed())}
                disabled={store.useRandomSeed}
                className="p-2 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-50"
                title="Randomize seed"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* NSFW Content */}
          <div className="border-t border-border pt-3">
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={nsfwEnabled}
                onChange={(e) => setNsfwEnabled(e.target.checked)}
                className="w-3 h-3 accent-accent"
              />
              Allow NSFW content
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
