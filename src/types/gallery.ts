export interface GalleryItem {
  id: string;
  type: import('./generation').GenerationType;
  provider: import('./generation').Provider;
  modelId: string;
  prompt: string;
  fullPrompt: string;
  params: import('./generation').GenerationParams;
  outputBlob?: Blob;
  thumbnail?: Blob;
  textContent?: string;
  createdAt: number;
  durationMs: number;
  isFavorite: boolean;
  tags: string[];
}

export interface GalleryFilters {
  type?: import('./generation').GenerationType;
  provider?: import('./generation').Provider;
  model?: string;
  search?: string;
  dateFrom?: number;
  dateTo?: number;
  favoritesOnly?: boolean;
}

export type GalleryViewMode = 'grid' | 'list';
export type GallerySortBy = 'date-desc' | 'date-asc' | 'duration' | 'model';
