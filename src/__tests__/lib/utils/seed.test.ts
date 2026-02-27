import { describe, it, expect, vi } from 'vitest';
import { randomSeed } from '@/lib/utils/seed';

describe('randomSeed', () => {
  it('returns a number', () => {
    expect(typeof randomSeed()).toBe('number');
  });

  it('returns an integer', () => {
    const seed = randomSeed();
    expect(Number.isInteger(seed)).toBe(true);
  });

  it('returns a value in range [0, 2147483646]', () => {
    // Run multiple times to increase confidence
    for (let i = 0; i < 100; i++) {
      const seed = randomSeed();
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2147483647);
    }
  });

  it('returns 0 when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomSeed()).toBe(0);
    vi.restoreAllMocks();
  });

  it('returns max-1 when Math.random returns near 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);
    const seed = randomSeed();
    expect(seed).toBeLessThan(2147483647);
    expect(seed).toBeGreaterThan(2147483640);
    vi.restoreAllMocks();
  });
});
