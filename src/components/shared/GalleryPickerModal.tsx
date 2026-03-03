'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { getAllGalleryItems } from '@/lib/db';
import { GalleryItem } from '@/types/gallery';
import { cn } from '@/lib/utils/cn';

interface GalleryPickerModalProps {
  onSelect: (url: string, blob: Blob) => void;
  onClose: () => void;
}

function ThumbnailCard({ item, onSelect }: { item: GalleryItem; onSelect: () => void }) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = item.thumbnail || item.outputBlob;
    if (blob) {
      const url = URL.createObjectURL(blob);
      setThumbUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.thumbnail, item.outputBlob]);

  return (
    <button
      onClick={onSelect}
      className="aspect-square rounded-lg overflow-hidden border border-border hover:border-accent/50 hover:ring-2 hover:ring-accent/30 transition-all bg-surface-hover"
    >
      {thumbUrl ? (
        <img src={thumbUrl} alt={item.prompt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-muted" />
        </div>
      )}
    </button>
  );
}

export function GalleryPickerModal({ onSelect, onClose }: GalleryPickerModalProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllGalleryItems({ type: 'image' }).then((result) => {
      setItems(result);
      setLoading(false);
    });
  }, []);

  const handleSelect = useCallback((item: GalleryItem) => {
    if (item.outputBlob) {
      const url = URL.createObjectURL(item.outputBlob);
      onSelect(url, item.outputBlob);
    }
  }, [onSelect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-xl w-full max-w-lg mx-4 max-h-[70vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-medium">Select from Gallery</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images in gallery yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {items.map((item) => (
                <ThumbnailCard key={item.id} item={item} onSelect={() => handleSelect(item)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
