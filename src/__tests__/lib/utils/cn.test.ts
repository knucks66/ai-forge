import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes with clsx', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
    expect(cn('base', true && 'visible')).toBe('base visible');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles empty and falsy inputs', () => {
    expect(cn('')).toBe('');
    expect(cn(undefined, null, false)).toBe('');
    expect(cn()).toBe('');
  });

  it('handles array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles object inputs', () => {
    expect(cn({ hidden: true, visible: false })).toBe('hidden');
  });

  it('merges complex Tailwind class combinations', () => {
    expect(cn('px-4 py-2 bg-blue-500', 'bg-red-500 px-2')).toBe('py-2 bg-red-500 px-2');
  });
});
