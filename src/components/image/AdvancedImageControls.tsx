'use client';

import { useImageStore } from '@/stores/useImageStore';
import { SliderControl } from '@/components/shared/SliderControl';
import { samplers } from '@/data/samplers';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, Shuffle } from 'lucide-react';
import { randomSeed } from '@/lib/utils/seed';

export function AdvancedImageControls() {
  const store = useImageStore();

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
        </div>
      )}
    </div>
  );
}
