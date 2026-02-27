import { openDB, IDBPDatabase } from 'idb';
import { GalleryItem, GalleryFilters } from '@/types/gallery';

const DB_NAME = 'ai-forge-db';
const DB_VERSION = 1;
const GALLERY_STORE = 'gallery';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(GALLERY_STORE)) {
          const store = db.createObjectStore(GALLERY_STORE, { keyPath: 'id' });
          store.createIndex('by-type', 'type');
          store.createIndex('by-date', 'createdAt');
          store.createIndex('by-model', 'modelId');
          store.createIndex('by-provider', 'provider');
          store.createIndex('by-favorite', 'isFavorite');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const db = await getDB();
  await db.put(GALLERY_STORE, item);
}

export async function getGalleryItem(id: string): Promise<GalleryItem | undefined> {
  const db = await getDB();
  return db.get(GALLERY_STORE, id);
}

export async function getAllGalleryItems(filters?: GalleryFilters): Promise<GalleryItem[]> {
  const db = await getDB();
  let items: GalleryItem[] = await db.getAll(GALLERY_STORE);

  // Sort by date descending by default
  items.sort((a, b) => b.createdAt - a.createdAt);

  if (filters) {
    if (filters.type) items = items.filter((i) => i.type === filters.type);
    if (filters.provider) items = items.filter((i) => i.provider === filters.provider);
    if (filters.model) items = items.filter((i) => i.modelId === filters.model);
    if (filters.favoritesOnly) items = items.filter((i) => i.isFavorite);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter((i) =>
        i.prompt.toLowerCase().includes(search) ||
        i.fullPrompt.toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search))
      );
    }
    if (filters.dateFrom) items = items.filter((i) => i.createdAt >= filters.dateFrom!);
    if (filters.dateTo) items = items.filter((i) => i.createdAt <= filters.dateTo!);
  }

  return items;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(GALLERY_STORE, id);
}

export async function toggleFavorite(id: string): Promise<void> {
  const db = await getDB();
  const item = await db.get(GALLERY_STORE, id);
  if (item) {
    item.isFavorite = !item.isFavorite;
    await db.put(GALLERY_STORE, item);
  }
}

export async function clearGallery(): Promise<void> {
  const db = await getDB();
  await db.clear(GALLERY_STORE);
}

export async function getGalleryCount(): Promise<number> {
  const db = await getDB();
  return db.count(GALLERY_STORE);
}

export async function generateThumbnail(blob: Blob, maxSize: number = 200): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((thumbBlob) => {
        resolve(thumbBlob || blob);
        URL.revokeObjectURL(img.src);
      }, 'image/jpeg', 0.7);
    };

    img.src = URL.createObjectURL(blob);
  });
}
