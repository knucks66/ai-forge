export interface ModelOption {
  id: string;
  name: string;
  provider: import('./generation').Provider;
  type: import('./generation').GenerationType;
  description?: string;
  tags?: string[];
}

export interface ModelsState {
  imageModels: ModelOption[];
  textModels: ModelOption[];
  audioModels: ModelOption[];
  videoModels: ModelOption[];
  lastFetched: Record<string, number>;
  isLoading: boolean;
}
