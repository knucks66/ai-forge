'use client';

import { cn } from '@/lib/utils/cn';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  className,
}: SliderControlProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted">{label}</label>
        <span className="text-xs font-mono text-accent">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          'w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer',
          'accent-accent',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
}
