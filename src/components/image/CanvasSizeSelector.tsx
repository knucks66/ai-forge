'use client';

import { canvasSizes } from '@/data/canvas-sizes';
import { cn } from '@/lib/utils/cn';

interface CanvasSizeSelectorProps {
  selected: string;
  onSelect: (sizeId: string) => void;
  customWidth: number;
  customHeight: number;
  onCustomWidthChange: (width: number) => void;
  onCustomHeightChange: (height: number) => void;
}

export function CanvasSizeSelector({
  selected,
  onSelect,
  customWidth,
  customHeight,
  onCustomWidthChange,
  onCustomHeightChange,
}: CanvasSizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted">Canvas Size</label>

      <div className="grid grid-cols-3 gap-1.5">
        {canvasSizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-xs transition-all border',
              selected === size.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:border-accent/50 hover:text-foreground'
            )}
          >
            {/* Aspect ratio preview */}
            {size.id !== 'custom' && (
              <div
                className={cn(
                  'border border-current rounded-sm',
                  selected === size.id ? 'border-accent' : 'border-muted/50'
                )}
                style={{
                  width: `${Math.min(24, size.width / size.height * 18)}px`,
                  height: `${Math.min(24, size.height / size.width * 18)}px`,
                }}
              />
            )}
            <span className="font-medium truncate w-full text-center">{size.name}</span>
            {size.id !== 'custom' && (
              <span className="text-[10px] opacity-70">{size.width}x{size.height}</span>
            )}
          </button>
        ))}
      </div>

      {/* Custom dimensions */}
      {selected === 'custom' && (
        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <label className="text-[10px] text-muted">Width</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => onCustomWidthChange(Math.max(128, Math.min(2048, Number(e.target.value))))}
              min={128}
              max={2048}
              step={64}
              className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-center focus:outline-none focus:border-accent"
            />
          </div>
          <span className="self-end pb-2 text-muted">x</span>
          <div className="flex-1">
            <label className="text-[10px] text-muted">Height</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => onCustomHeightChange(Math.max(128, Math.min(2048, Number(e.target.value))))}
              min={128}
              max={2048}
              step={64}
              className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-center focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
