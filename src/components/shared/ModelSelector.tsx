'use client';

import { useModelsStore } from '@/stores/useModelsStore';
import { useModels } from '@/lib/hooks/useModels';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { GenerationType, Provider } from '@/types/generation';
import { ModelOption, ModelCapabilities } from '@/types/models';

interface ModelSelectorProps {
  type: GenerationType;
  selectedModel: string;
  selectedProvider: Provider;
  onSelect: (model: string, provider: Provider) => void;
  className?: string;
  requiredCapability?: keyof ModelCapabilities;
}

export function ModelSelector({
  type,
  selectedModel,
  selectedProvider,
  onSelect,
  className,
  requiredCapability,
}: ModelSelectorProps) {
  const store = useModelsStore();
  const { refresh, isLoading } = useModels();

  let models: ModelOption[] =
    type === 'image' ? store.imageModels :
    type === 'text' ? store.textModels :
    type === 'audio' ? store.audioModels :
    store.videoModels;

  // Filter by required capability if specified
  if (requiredCapability) {
    models = models.filter((m) => m.capabilities?.[requiredCapability]);
  }

  const pollinationsModels = models.filter((m) => m.provider === 'pollinations');
  const hfModels = models.filter((m) => m.provider === 'huggingface');

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-muted">Model</label>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1 disabled:opacity-50"
          title="Refresh model list from APIs"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">{isLoading ? 'Fetching...' : 'Refresh'}</span>
        </button>
      </div>
      <div className="relative">
        <select
          value={`${selectedProvider}:${selectedModel}`}
          onChange={(e) => {
            const [provider, ...modelParts] = e.target.value.split(':');
            onSelect(modelParts.join(':'), provider as Provider);
          }}
          className={cn(
            'w-full px-3 py-2 bg-background border border-border rounded-lg text-sm appearance-none cursor-pointer',
            'focus:outline-none focus:border-accent pr-8'
          )}
        >
          {pollinationsModels.length > 0 && (
            <optgroup label="Pollinations (Free)">
              {pollinationsModels.map((m) => (
                <option key={`p-${m.id}`} value={`pollinations:${m.id}`}>
                  {m.name}{m.capabilities?.supportsImageInput ? ' *' : ''}
                </option>
              ))}
            </optgroup>
          )}
          {hfModels.length > 0 && (
            <optgroup label="HuggingFace (Token Required)">
              {hfModels.map((m) => (
                <option key={`hf-${m.id}`} value={`huggingface:${m.id}`}>
                  {m.name}{m.capabilities?.supportsImageInput ? ' *' : ''}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
      <p className="text-[10px] text-muted mt-1">
        {models.length} models available · Auto-refreshes hourly
      </p>
    </div>
  );
}
