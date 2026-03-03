'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, GalleryHorizontalEnd } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { validateImageFile } from '@/lib/utils/image';
import { GalleryPickerModal } from './GalleryPickerModal';
import toast from 'react-hot-toast';

interface ImageDropZoneProps {
  imageUrl: string | null;
  onImageSet: (url: string, blob: Blob) => void;
  onImageClear: () => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

export function ImageDropZone({
  imageUrl,
  onImageSet,
  onImageClear,
  disabled = false,
  label = 'Source Image',
  compact = false,
}: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }
    const url = URL.createObjectURL(file);
    onImageSet(url, file);
  }, [onImageSet]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [handleFile]);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted">{label}</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !imageUrl && fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors',
          compact ? 'p-2' : 'p-4',
          isDragOver && 'border-accent bg-accent/10',
          !isDragOver && !imageUrl && 'border-border hover:border-accent/50 cursor-pointer',
          imageUrl && 'border-accent/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {imageUrl ? (
          <div className={cn('flex items-center gap-3', compact ? 'flex-row' : 'flex-col')}>
            <img
              src={imageUrl}
              alt="Source"
              className={cn(
                'object-cover rounded-md',
                compact ? 'w-16 h-16' : 'w-full max-h-32'
              )}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={disabled}
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Replace
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClear();
                }}
                disabled={disabled}
                className="p-1 rounded text-muted hover:text-red-400 transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={cn(
            'flex items-center text-muted',
            compact ? 'flex-row gap-2' : 'flex-col gap-1.5'
          )}>
            {isDragOver ? (
              <ImageIcon className={cn(compact ? 'w-5 h-5' : 'w-8 h-8', 'text-accent')} />
            ) : (
              <Upload className={cn(compact ? 'w-5 h-5' : 'w-8 h-8')} />
            )}
            <span className="text-xs text-center">
              {isDragOver ? 'Drop image here' : 'Drop image or click to upload'}
            </span>
            {!isDragOver && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGalleryPicker(true);
                }}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
              >
                <GalleryHorizontalEnd className="w-3.5 h-3.5" />
                Browse gallery
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {showGalleryPicker && (
        <GalleryPickerModal
          onSelect={(url, blob) => {
            onImageSet(url, blob);
            setShowGalleryPicker(false);
          }}
          onClose={() => setShowGalleryPicker(false)}
        />
      )}
    </div>
  );
}
