import { describe, it, expect } from 'vitest';
import { defaultImageModels, defaultTextModels, defaultAudioModels, defaultVideoModels } from '@/data/default-models';

const allModels = [
  { name: 'defaultImageModels', models: defaultImageModels, expectedType: 'image' },
  { name: 'defaultTextModels', models: defaultTextModels, expectedType: 'text' },
  { name: 'defaultAudioModels', models: defaultAudioModels, expectedType: 'audio' },
  { name: 'defaultVideoModels', models: defaultVideoModels, expectedType: 'video' },
];

describe.each(allModels)('$name', ({ models, expectedType }) => {
  it('has at least one model', () => {
    expect(models.length).toBeGreaterThanOrEqual(1);
  });

  it('every model has required fields', () => {
    for (const model of models) {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(['pollinations', 'huggingface']).toContain(model.provider);
      expect(model.type).toBe(expectedType);
    }
  });

  it('has no duplicate IDs within the same provider', () => {
    const byProvider = new Map<string, string[]>();
    for (const model of models) {
      const ids = byProvider.get(model.provider) || [];
      ids.push(model.id);
      byProvider.set(model.provider, ids);
    }
    for (const [, ids] of byProvider) {
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('defaultImageModels', () => {
  it('includes both pollinations and huggingface providers', () => {
    const providers = new Set(defaultImageModels.map((m) => m.provider));
    expect(providers.has('pollinations')).toBe(true);
    expect(providers.has('huggingface')).toBe(true);
  });
});

describe('defaultTextModels', () => {
  it('includes both pollinations and huggingface providers', () => {
    const providers = new Set(defaultTextModels.map((m) => m.provider));
    expect(providers.has('pollinations')).toBe(true);
    expect(providers.has('huggingface')).toBe(true);
  });
});

describe('defaultVideoModels', () => {
  it('includes both pollinations and huggingface providers', () => {
    const providers = new Set(defaultVideoModels.map((m) => m.provider));
    expect(providers.has('pollinations')).toBe(true);
    expect(providers.has('huggingface')).toBe(true);
  });

  it('Pollinations video models have video capabilities', () => {
    const pollinationsVideo = defaultVideoModels.filter((m) => m.provider === 'pollinations');
    for (const model of pollinationsVideo) {
      expect(model.capabilities?.supportsVideoOutput).toBe(true);
      expect(model.capabilities?.supportsImageToVideo).toBe(true);
      expect(model.capabilities?.supportedVideoParams).toBeDefined();
    }
  });
});

describe('image models with capabilities', () => {
  it('known img2img models have supportsImageInput capability', () => {
    const img2imgModels = defaultImageModels.filter((m) => m.capabilities?.supportsImageInput);
    expect(img2imgModels.length).toBeGreaterThanOrEqual(1);
    const ids = img2imgModels.map((m) => m.id);
    expect(ids).toContain('kontext');
    expect(ids).toContain('klein');
    expect(ids).toContain('gptimage');
  });
});
