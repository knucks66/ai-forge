export interface ModelCapabilities {
  supportsImageInput?: boolean;
  supportsVideoOutput?: boolean;
  supportsImageToVideo?: boolean;
  supportedVideoParams?: { duration?: boolean; aspectRatio?: boolean; audio?: boolean };
}

export interface ModelOption {
  id: string;
  name: string;
  provider: import('./generation').Provider;
  type: import('./generation').GenerationType;
  description?: string;
  tags?: string[];
  capabilities?: ModelCapabilities;
}

export interface ModelsState {
  imageModels: ModelOption[];
  textModels: ModelOption[];
  audioModels: ModelOption[];
  videoModels: ModelOption[];
  lastFetched: Record<string, number>;
  isLoading: boolean;
}
