import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { GalleryItem } from '@/types/gallery';

// Must dynamically import after fake-indexeddb is loaded
let saveGalleryItem: typeof import('@/lib/db/index').saveGalleryItem;
let getGalleryItem: typeof import('@/lib/db/index').getGalleryItem;
let getAllGalleryItems: typeof import('@/lib/db/index').getAllGalleryItems;
let deleteGalleryItem: typeof import('@/lib/db/index').deleteGalleryItem;
let toggleFavorite: typeof import('@/lib/db/index').toggleFavorite;
let clearGallery: typeof import('@/lib/db/index').clearGallery;
let getGalleryCount: typeof import('@/lib/db/index').getGalleryCount;

beforeEach(async () => {
  // Re-import to get fresh module (fake-indexeddb resets per import)
  const db = await import('@/lib/db/index');
  saveGalleryItem = db.saveGalleryItem;
  getGalleryItem = db.getGalleryItem;
  getAllGalleryItems = db.getAllGalleryItems;
  deleteGalleryItem = db.deleteGalleryItem;
  toggleFavorite = db.toggleFavorite;
  clearGallery = db.clearGallery;
  getGalleryCount = db.getGalleryCount;

  // Clear gallery between tests
  await clearGallery();
});

function makeItem(overrides: Partial<GalleryItem> = {}): GalleryItem {
  return {
    id: 'item-1',
    type: 'image',
    provider: 'pollinations',
    modelId: 'flux',
    prompt: 'a cat',
    fullPrompt: 'photorealistic photograph of a cat',
    params: { prompt: 'a cat', model: 'flux', provider: 'pollinations' },
    createdAt: Date.now(),
    durationMs: 3000,
    isFavorite: false,
    tags: ['cat', 'animal'],
    ...overrides,
  };
}

describe('saveGalleryItem / getGalleryItem', () => {
  it('saves and retrieves an item', async () => {
    const item = makeItem();
    await saveGalleryItem(item);

    const retrieved = await getGalleryItem('item-1');
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe('item-1');
    expect(retrieved!.prompt).toBe('a cat');
  });

  it('returns undefined for non-existent ID', async () => {
    const result = await getGalleryItem('nonexistent');
    expect(result).toBeUndefined();
  });

  it('upserts on same ID', async () => {
    await saveGalleryItem(makeItem({ prompt: 'v1' }));
    await saveGalleryItem(makeItem({ prompt: 'v2' }));

    const item = await getGalleryItem('item-1');
    expect(item!.prompt).toBe('v2');
  });
});

describe('getAllGalleryItems', () => {
  it('returns all items sorted by date descending', async () => {
    await saveGalleryItem(makeItem({ id: '1', createdAt: 1000 }));
    await saveGalleryItem(makeItem({ id: '2', createdAt: 3000 }));
    await saveGalleryItem(makeItem({ id: '3', createdAt: 2000 }));

    const items = await getAllGalleryItems();
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe('2'); // newest first
    expect(items[1].id).toBe('3');
    expect(items[2].id).toBe('1');
  });

  it('filters by type', async () => {
    await saveGalleryItem(makeItem({ id: '1', type: 'image' }));
    await saveGalleryItem(makeItem({ id: '2', type: 'text' }));

    const images = await getAllGalleryItems({ type: 'image' });
    expect(images).toHaveLength(1);
    expect(images[0].id).toBe('1');
  });

  it('filters by provider', async () => {
    await saveGalleryItem(makeItem({ id: '1', provider: 'pollinations' }));
    await saveGalleryItem(makeItem({ id: '2', provider: 'huggingface' }));

    const hf = await getAllGalleryItems({ provider: 'huggingface' });
    expect(hf).toHaveLength(1);
    expect(hf[0].id).toBe('2');
  });

  it('filters by model', async () => {
    await saveGalleryItem(makeItem({ id: '1', modelId: 'flux' }));
    await saveGalleryItem(makeItem({ id: '2', modelId: 'turbo' }));

    const flux = await getAllGalleryItems({ model: 'flux' });
    expect(flux).toHaveLength(1);
  });

  it('filters by favoritesOnly', async () => {
    await saveGalleryItem(makeItem({ id: '1', isFavorite: true }));
    await saveGalleryItem(makeItem({ id: '2', isFavorite: false }));

    const favs = await getAllGalleryItems({ favoritesOnly: true });
    expect(favs).toHaveLength(1);
    expect(favs[0].id).toBe('1');
  });

  it('filters by search (prompt)', async () => {
    await saveGalleryItem(makeItem({ id: '1', prompt: 'a cute cat', fullPrompt: 'a cute cat photo', tags: [] }));
    await saveGalleryItem(makeItem({ id: '2', prompt: 'a big dog', fullPrompt: 'a big dog photo', tags: [] }));

    const result = await getAllGalleryItems({ search: 'cat' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by search (tags)', async () => {
    await saveGalleryItem(makeItem({ id: '1', prompt: 'image', tags: ['nature'] }));
    await saveGalleryItem(makeItem({ id: '2', prompt: 'image', tags: ['urban'] }));

    const result = await getAllGalleryItems({ search: 'nature' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by date range', async () => {
    await saveGalleryItem(makeItem({ id: '1', createdAt: 1000 }));
    await saveGalleryItem(makeItem({ id: '2', createdAt: 2000 }));
    await saveGalleryItem(makeItem({ id: '3', createdAt: 3000 }));

    const result = await getAllGalleryItems({ dateFrom: 1500, dateTo: 2500 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('combines multiple filters', async () => {
    await saveGalleryItem(makeItem({ id: '1', type: 'image', isFavorite: true }));
    await saveGalleryItem(makeItem({ id: '2', type: 'image', isFavorite: false }));
    await saveGalleryItem(makeItem({ id: '3', type: 'text', isFavorite: true }));

    const result = await getAllGalleryItems({ type: 'image', favoritesOnly: true });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('deleteGalleryItem', () => {
  it('removes an item by ID', async () => {
    await saveGalleryItem(makeItem({ id: '1' }));
    await deleteGalleryItem('1');

    const result = await getGalleryItem('1');
    expect(result).toBeUndefined();
  });

  it('does not throw for non-existent ID', async () => {
    await expect(deleteGalleryItem('nonexistent')).resolves.toBeUndefined();
  });
});

describe('toggleFavorite', () => {
  it('toggles isFavorite from false to true', async () => {
    await saveGalleryItem(makeItem({ id: '1', isFavorite: false }));
    await toggleFavorite('1');

    const item = await getGalleryItem('1');
    expect(item!.isFavorite).toBe(true);
  });

  it('toggles isFavorite from true to false', async () => {
    await saveGalleryItem(makeItem({ id: '1', isFavorite: true }));
    await toggleFavorite('1');

    const item = await getGalleryItem('1');
    expect(item!.isFavorite).toBe(false);
  });

  it('does nothing for non-existent ID', async () => {
    await expect(toggleFavorite('nonexistent')).resolves.toBeUndefined();
  });
});

describe('clearGallery', () => {
  it('removes all items', async () => {
    await saveGalleryItem(makeItem({ id: '1' }));
    await saveGalleryItem(makeItem({ id: '2' }));

    await clearGallery();

    const items = await getAllGalleryItems();
    expect(items).toHaveLength(0);
  });
});

describe('getGalleryCount', () => {
  it('returns 0 for empty gallery', async () => {
    const count = await getGalleryCount();
    expect(count).toBe(0);
  });

  it('returns correct count', async () => {
    await saveGalleryItem(makeItem({ id: '1' }));
    await saveGalleryItem(makeItem({ id: '2' }));
    await saveGalleryItem(makeItem({ id: '3' }));

    const count = await getGalleryCount();
    expect(count).toBe(3);
  });
});
