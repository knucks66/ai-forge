import { describe, it, expect } from 'vitest';
import { detectNsfwPrompt, isNsfwPreset } from '@/lib/utils/nsfw-detect';

describe('detectNsfwPrompt', () => {
  it('detects nsfw keyword', () => {
    expect(detectNsfwPrompt('a nsfw picture of a dragon')).toBe(true);
  });

  it('detects nude keyword', () => {
    expect(detectNsfwPrompt('nude figure painting')).toBe(true);
  });

  it('detects hentai keyword', () => {
    expect(detectNsfwPrompt('anime hentai style')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(detectNsfwPrompt('NSFW content')).toBe(true);
    expect(detectNsfwPrompt('Explicit scene')).toBe(true);
  });

  it('detects multi-word keywords', () => {
    expect(detectNsfwPrompt('some adult content here')).toBe(true);
    expect(detectNsfwPrompt('r-rated movie poster')).toBe(true);
  });

  it('returns false for clean prompts', () => {
    expect(detectNsfwPrompt('a beautiful sunset over the ocean')).toBe(false);
    expect(detectNsfwPrompt('portrait of a knight in armor')).toBe(false);
    expect(detectNsfwPrompt('')).toBe(false);
  });
});

describe('isNsfwPreset', () => {
  const presets = [
    { id: 'realistic', nsfw: false },
    { id: 'anime', nsfw: false },
    { id: 'erotic-art', nsfw: true },
    { id: 'no-flag' },
  ];

  it('returns true for nsfw preset', () => {
    expect(isNsfwPreset('erotic-art', presets)).toBe(true);
  });

  it('returns false for non-nsfw preset', () => {
    expect(isNsfwPreset('realistic', presets)).toBe(false);
    expect(isNsfwPreset('anime', presets)).toBe(false);
  });

  it('returns false when nsfw flag is undefined', () => {
    expect(isNsfwPreset('no-flag', presets)).toBe(false);
  });

  it('returns false for unknown preset id', () => {
    expect(isNsfwPreset('nonexistent', presets)).toBe(false);
  });
});
