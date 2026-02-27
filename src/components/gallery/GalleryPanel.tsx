'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllGalleryItems, deleteGalleryItem, toggleFavorite } from '@/lib/db';
import { GalleryItem, GalleryFilters, GalleryViewMode } from '@/types/gallery';
import { GalleryCard } from './GalleryCard';
import { GalleryDetail } from './GalleryDetail';
import { cn } from '@/lib/utils/cn';
import { Search, Grid3X3, List, Image, MessageSquare, Music, Video, Heart, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { GenerationType } from '@/types/generation';

export function GalleryPanel() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<GalleryViewMode>('grid');
  const [filters, setFilters] = useState<GalleryFilters>({});
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [displayCount, setDisplayCount] = useState(20);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllGalleryItems(filters);
      setItems(result);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async (id: string) => {
    await deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success('Item deleted');
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setDisplayCount((prev) => Math.min(prev + 20, items.length));
    }
  };

  const typeFilters: { type: GenerationType | undefined; icon: React.ElementType; label: string }[] = [
    { type: undefined, icon: Grid3X3, label: 'All' },
    { type: 'image', icon: Image, label: 'Images' },
    { type: 'text', icon: MessageSquare, label: 'Text' },
    { type: 'audio', icon: Music, label: 'Audio' },
    { type: 'video', icon: Video, label: 'Video' },
  ];

  const displayedItems = items.slice(0, displayCount);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
            placeholder="Search prompts..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((f) => ({ ...f, search: undefined }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type filters */}
        <div className="flex gap-1">
          {typeFilters.map(({ type, icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setFilters((f) => ({ ...f, type }))}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filters.type === type
                  ? 'bg-accent/15 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Favorites toggle */}
        <button
          onClick={() => setFilters((f) => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
            filters.favoritesOnly
              ? 'bg-red-500/15 text-red-400'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', filters.favoritesOnly && 'fill-current')} />
        </button>

        {/* View mode */}
        <div className="flex gap-0.5 bg-surface rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-1.5 rounded', viewMode === 'grid' ? 'bg-surface-hover text-foreground' : 'text-muted')}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-1.5 rounded', viewMode === 'list' ? 'bg-surface-hover text-foreground' : 'text-muted')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted">{items.length} items</p>

      {/* Gallery grid/list */}
      <div
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {loading ? (
          <div className={cn(
            'gap-3',
            viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'space-y-2'
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={cn(
                'skeleton rounded-xl',
                viewMode === 'grid' ? 'aspect-square' : 'h-20'
              )} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted">
            <div className="text-center space-y-2">
              <Grid3X3 className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm">No items in gallery</p>
              <p className="text-xs">Generate something to see it here</p>
            </div>
          </div>
        ) : (
          <div className={cn(
            'gap-3',
            viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'space-y-2'
          )}>
            {displayedItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onClick={() => setSelectedItem(item)}
                onDelete={() => handleDelete(item.id)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <GalleryDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={() => handleDelete(selectedItem.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedItem.id)}
        />
      )}
    </div>
  );
}
