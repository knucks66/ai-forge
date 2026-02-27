'use client';

import { useState, useEffect } from 'react';
import { GalleryItem, GalleryViewMode } from '@/types/gallery';
import { cn } from '@/lib/utils/cn';
import { Heart, Trash2, Image, MessageSquare, Music, Video } from 'lucide-react';
import { formatDate, truncateText, formatDuration } from '@/lib/utils/formatters';

interface GalleryCardProps {
  item: GalleryItem;
  viewMode: GalleryViewMode;
  onClick: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

const typeIcons = {
  image: Image,
  text: MessageSquare,
  audio: Music,
  video: Video,
};

export function GalleryCard({ item, viewMode, onClick, onDelete, onToggleFavorite }: GalleryCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.thumbnail) {
      const url = URL.createObjectURL(item.thumbnail);
      setThumbnailUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (item.outputBlob && item.type === 'image') {
      const url = URL.createObjectURL(item.outputBlob);
      setThumbnailUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.thumbnail, item.outputBlob, item.type]);

  const TypeIcon = typeIcons[item.type];

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/50 hover:bg-surface-hover transition-all cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-lg bg-surface-hover flex items-center justify-center shrink-0 overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <TypeIcon className="w-5 h-5 text-muted" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.prompt}</p>
          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
            <span>{item.provider}</span>
            <span>·</span>
            <span>{formatDuration(item.durationMs)}</span>
            <span>·</span>
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-red-400"
          >
            <Heart className={cn('w-4 h-4', item.isFavorite && 'fill-red-400 text-red-400')} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-all cursor-pointer"
    >
      {/* Image/Thumbnail */}
      <div className="aspect-square bg-surface-hover flex items-center justify-center">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center space-y-1">
            <TypeIcon className="w-6 h-6 text-muted mx-auto" />
            <p className="text-xs text-muted">{item.type}</p>
          </div>
        )}
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-xs text-white truncate">{truncateText(item.prompt, 50)}</p>
          <p className="text-[10px] text-white/60 mt-0.5">{formatDuration(item.durationMs)}</p>
        </div>
      </div>

      {/* Favorite badge */}
      {item.isFavorite && (
        <div className="absolute top-1.5 right-1.5">
          <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
        </div>
      )}

      {/* Type badge */}
      <div className="absolute top-1.5 left-1.5 p-1 rounded bg-black/40">
        <TypeIcon className="w-3 h-3 text-white" />
      </div>

      {/* Hover actions */}
      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-1 rounded bg-black/40 text-white hover:bg-black/60"
        >
          <Heart className={cn('w-3 h-3', item.isFavorite && 'fill-red-400 text-red-400')} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded bg-black/40 text-white hover:bg-red-500/80"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
