'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllGalleryItems, deleteGalleryItem, toggleFavorite, clearGallery } from '@/lib/db';
import { GalleryItem, GalleryFilters } from '@/types/gallery';

export function useGallery(filters?: GalleryFilters) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllGalleryItems(filters);
      setItems(result);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (id: string) => {
    await deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const favorite = async (id: string) => {
    await toggleFavorite(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i))
    );
  };

  const clear = async () => {
    await clearGallery();
    setItems([]);
  };

  return { items, loading, refresh, remove, favorite, clear };
}
