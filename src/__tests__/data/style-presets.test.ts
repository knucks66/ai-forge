import { describe, it, expect } from 'vitest';
import { stylePresets, styleCategories, StyleCategory } from '@/data/style-presets';

describe('stylePresets', () => {
  it('has at least 60 presets', () => {
    expect(stylePresets.length).toBeGreaterThanOrEqual(60);
  });

  it('every preset has required fields', () => {
    for (const preset of stylePresets) {
      expect(preset.id).toBeTruthy();
      expect(typeof preset.id).toBe('string');
      expect(preset.name).toBeTruthy();
      expect(typeof preset.name).toBe('string');
      expect(preset.category).toBeTruthy();
      expect(typeof preset.promptPrefix).toBe('string');
      expect(typeof preset.promptSuffix).toBe('string');
      expect(preset.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = stylePresets.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every category is a valid StyleCategory', () => {
    const validCategories = styleCategories.map((c) => c.id);
    for (const preset of stylePresets) {
      expect(validCategories).toContain(preset.category);
    }
  });

  it('includes a "none" preset', () => {
    const none = stylePresets.find((p) => p.id === 'none');
    expect(none).toBeDefined();
    expect(none!.promptPrefix).toBe('');
    expect(none!.promptSuffix).toBe('');
  });

  it('covers all style categories', () => {
    const presetCategories = new Set(stylePresets.map((p) => p.category));
    for (const cat of styleCategories) {
      expect(presetCategories.has(cat.id)).toBe(true);
    }
  });

  it('suggestedCfg is a positive number when present', () => {
    const presetsWithCfg = stylePresets.filter((p) => p.suggestedCfg !== undefined);
    expect(presetsWithCfg.length).toBeGreaterThan(0);
    for (const preset of presetsWithCfg) {
      expect(preset.suggestedCfg).toBeGreaterThan(0);
    }
  });
});

describe('styleCategories', () => {
  it('has 10 categories', () => {
    expect(styleCategories).toHaveLength(10);
  });

  it('starts with "none"', () => {
    expect(styleCategories[0].id).toBe('none');
  });

  it('every category has id and name', () => {
    for (const cat of styleCategories) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
    }
  });

  it('has no duplicate category IDs', () => {
    const ids = styleCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
