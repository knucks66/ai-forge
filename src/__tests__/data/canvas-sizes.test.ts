import { describe, it, expect } from 'vitest';
import { canvasSizes } from '@/data/canvas-sizes';

describe('canvasSizes', () => {
  it('has at least 10 sizes', () => {
    expect(canvasSizes.length).toBeGreaterThanOrEqual(10);
  });

  it('every size has required fields', () => {
    for (const size of canvasSizes) {
      expect(size.id).toBeTruthy();
      expect(typeof size.id).toBe('string');
      expect(size.name).toBeTruthy();
      expect(typeof size.name).toBe('string');
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
      expect(size.aspect).toBeTruthy();
    }
  });

  it('has no duplicate IDs', () => {
    const ids = canvasSizes.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes a "custom" entry', () => {
    const custom = canvasSizes.find((s) => s.id === 'custom');
    expect(custom).toBeDefined();
    expect(custom!.aspect).toBe('custom');
  });

  it('includes a "square" entry with equal dimensions', () => {
    const square = canvasSizes.find((s) => s.id === 'square');
    expect(square).toBeDefined();
    expect(square!.width).toBe(square!.height);
  });

  it('all dimensions are positive integers', () => {
    for (const size of canvasSizes) {
      expect(Number.isInteger(size.width)).toBe(true);
      expect(Number.isInteger(size.height)).toBe(true);
    }
  });
});
