'use client';

import { useState, useEffect } from 'react';
import { GalleryItem } from '@/types/gallery';
import { cn } from '@/lib/utils/cn';
import { X, Heart, Trash2, Download, Copy, RefreshCw, Clock, Cpu, Palette } from 'lucide-react';
import { formatDate, formatDuration } from '@/lib/utils/formatters';
import { downloadBlob } from '@/lib/utils/download';
import { useAppStore } from '@/stores/useAppStore';
import { useImageStore } from '@/stores/useImageStore';
import toast from 'react-hot-toast';

interface GalleryDetailProps {
  item: GalleryItem;
  onClose: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function GalleryDetail({ item, onClose, onDelete, onToggleFavorite }: GalleryDetailProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const setActiveMode = useAppStore((s) => s.setActiveMode);
  const imageStore = useImageStore();

  useEffect(() => {
    if (item.outputBlob) {
      const url = URL.createObjectURL(item.outputBlob);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.outputBlob]);

  const handleDownload = () => {
    if (item.outputBlob) {
      const ext = item.type === 'audio' ? 'mp3' : item.type === 'video' ? 'mp4' : 'png';
      downloadBlob(item.outputBlob, `ai-forge-${item.type}-${item.id}.${ext}`);
    }
  };

  const handleRegenerate = () => {
    if (item.type === 'image') {
      imageStore.setPrompt(item.prompt);
      if (item.params.model) imageStore.setModel(item.params.model);
      if (item.params.provider) imageStore.setProvider(item.params.provider);
      if (item.params.width) imageStore.setWidth(item.params.width);
      if (item.params.height) imageStore.setHeight(item.params.height);
      setActiveMode('image');
      onClose();
      toast.success('Settings loaded. Click Generate to re-create.');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(item.fullPrompt || item.prompt);
    toast.success('Prompt copied');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium truncate flex-1 mr-4">{item.prompt}</h3>
          <div className="flex items-center gap-1">
            <button onClick={onToggleFavorite} className="p-1.5 rounded-lg text-muted hover:text-red-400">
              <Heart className={cn('w-4 h-4', item.isFavorite && 'fill-red-400 text-red-400')} />
            </button>
            <button onClick={copyPrompt} className="p-1.5 rounded-lg text-muted hover:text-foreground" title="Copy prompt">
              <Copy className="w-4 h-4" />
            </button>
            {item.outputBlob && (
              <button onClick={handleDownload} className="p-1.5 rounded-lg text-muted hover:text-foreground" title="Download">
                <Download className="w-4 h-4" />
              </button>
            )}
            {item.type === 'image' && (
              <button onClick={handleRegenerate} className="p-1.5 rounded-lg text-muted hover:text-accent" title="Re-generate">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button onClick={onDelete} className="p-1.5 rounded-lg text-muted hover:text-red-400" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-foreground ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Media preview */}
            <div className="md:col-span-2 flex items-center justify-center bg-background rounded-xl p-2 min-h-[300px]">
              {item.type === 'image' && mediaUrl && (
                <img src={mediaUrl} alt={item.prompt} className="max-w-full max-h-[60vh] object-contain rounded-lg" />
              )}
              {item.type === 'audio' && mediaUrl && (
                <audio src={mediaUrl} controls className="w-full" />
              )}
              {item.type === 'video' && mediaUrl && (
                <video src={mediaUrl} controls className="max-w-full max-h-[60vh] rounded-lg" />
              )}
              {item.type === 'text' && item.textContent && (
                <div className="w-full p-4 text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                  {item.textContent}
                </div>
              )}
              {!mediaUrl && !item.textContent && (
                <p className="text-muted text-sm">Preview not available</p>
              )}
            </div>

            {/* Details sidebar */}
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted uppercase tracking-wider">Details</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{item.modelId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Palette className="w-3.5 h-3.5" />
                    <span className="capitalize">{item.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(item.durationMs)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted uppercase tracking-wider">Prompt</h4>
                <p className="text-xs text-muted bg-background rounded-lg p-2 whitespace-pre-wrap">{item.prompt}</p>
              </div>

              {item.fullPrompt && item.fullPrompt !== item.prompt && (
                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-muted uppercase tracking-wider">Full Prompt</h4>
                  <p className="text-xs text-muted bg-background rounded-lg p-2 whitespace-pre-wrap">{item.fullPrompt}</p>
                </div>
              )}

              {item.params && (
                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-muted uppercase tracking-wider">Parameters</h4>
                  <div className="bg-background rounded-lg p-2 space-y-1">
                    {item.params.width && <p className="text-xs text-muted">Size: {item.params.width}x{item.params.height}</p>}
                    {item.params.cfgScale && <p className="text-xs text-muted">CFG: {item.params.cfgScale}</p>}
                    {item.params.steps && <p className="text-xs text-muted">Steps: {item.params.steps}</p>}
                    {item.params.seed !== undefined && item.params.seed >= 0 && <p className="text-xs text-muted">Seed: {item.params.seed}</p>}
                    {item.params.voice && <p className="text-xs text-muted">Voice: {item.params.voice}</p>}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted">
                Created: {formatDate(item.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
