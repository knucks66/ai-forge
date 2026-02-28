'use client';

import { useState, useRef, useEffect } from 'react';
import { useModelsStore } from '@/stores/useModelsStore';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { useModels } from '@/lib/hooks/useModels';
import { cn } from '@/lib/utils/cn';
import { formatCredits } from '@/lib/utils/formatters';
import { ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { GenerationType, Provider } from '@/types/generation';
import { ModelOption, ModelCapabilities } from '@/types/models';
import toast from 'react-hot-toast';

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
  const balanceStore = useBalanceStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedModelObj = models.find(
    (m) => m.id === selectedModel && m.provider === selectedProvider
  );

  const pollinationsBalance = balanceStore.pollinations?.balance ?? null;

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function getCostTier(m: ModelOption): 'free' | 'credits' | 'paid' {
    if (m.paidOnly) return 'paid';
    if (m.costsCredits) return 'credits';
    return 'free';
  }

  function getBadge(tier: 'free' | 'credits' | 'paid') {
    switch (tier) {
      case 'paid': return { label: 'PAID', className: 'bg-red-500/15 text-red-400' };
      case 'credits': return { label: 'CREDITS', className: 'bg-amber-500/15 text-amber-400' };
      default: return { label: 'FREE', className: 'bg-emerald-500/15 text-emerald-400' };
    }
  }

  function handleSelect(model: ModelOption) {
    const tier = getCostTier(model);
    if (tier !== 'free' && pollinationsBalance !== null && pollinationsBalance <= 0) {
      toast('This model costs credits and your balance is 0.', { icon: '⚠️', duration: 3000 });
    }
    onSelect(model.id, model.provider);
    setIsOpen(false);
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
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

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-left cursor-pointer',
          'focus:outline-none focus:border-accent pr-8 flex items-center gap-2'
        )}
      >
        <span className="flex-1 truncate">
          {selectedModelObj?.name || selectedModel}
        </span>
        <span className={cn(
          'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
          selectedProvider === 'pollinations'
            ? 'bg-blue-500/15 text-blue-400'
            : 'bg-yellow-500/15 text-yellow-400'
        )}>
          {selectedProvider === 'pollinations' ? 'Poll' : 'HF'}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted shrink-0 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto animate-fade-in">
          {/* Pollinations group */}
          {pollinationsModels.length > 0 && (
            <div>
              <div className="sticky top-0 px-3 py-1.5 bg-surface border-b border-border flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Pollinations</span>
                {pollinationsBalance !== null && (
                  <span className="text-[10px] font-medium text-blue-400">
                    {formatCredits(pollinationsBalance)} credits
                  </span>
                )}
              </div>
              {pollinationsModels.map((m) => {
                const isSelected = m.id === selectedModel && m.provider === selectedProvider;
                const tier = getCostTier(m);
                const badge = getBadge(tier);
                const isUnaffordable = tier !== 'free' && pollinationsBalance !== null && pollinationsBalance <= 0;
                return (
                  <button
                    key={`p-${m.id}`}
                    onClick={() => handleSelect(m)}
                    className={cn(
                      'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 transition-colors',
                      isSelected
                        ? 'bg-accent/15 text-accent'
                        : 'hover:bg-surface-hover text-foreground',
                      isUnaffordable && 'opacity-50'
                    )}
                  >
                    <span className="flex-1 truncate">
                      {m.name}
                      {m.capabilities?.supportsImageInput ? ' *' : ''}
                    </span>
                    <span className={cn(
                      'text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0',
                      badge.className
                    )}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* HuggingFace group */}
          {hfModels.length > 0 && (
            <div>
              <div className="sticky top-0 px-3 py-1.5 bg-surface border-b border-border flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">HuggingFace</span>
                {balanceStore.huggingface && (
                  <span className="text-[10px] font-medium text-yellow-400">
                    {balanceStore.huggingface.plan}
                  </span>
                )}
              </div>
              {hfModels.map((m) => {
                const isSelected = m.id === selectedModel && m.provider === selectedProvider;
                const tier = getCostTier(m);
                const badge = getBadge(tier);
                return (
                  <button
                    key={`hf-${m.id}`}
                    onClick={() => handleSelect(m)}
                    className={cn(
                      'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 transition-colors',
                      isSelected
                        ? 'bg-accent/15 text-accent'
                        : 'hover:bg-surface-hover text-foreground'
                    )}
                  >
                    <span className="flex-1 truncate">
                      {m.name}
                      {m.capabilities?.supportsImageInput ? ' *' : ''}
                    </span>
                    <span className={cn(
                      'text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0',
                      badge.className
                    )}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted mt-1">
        {models.length} models available · Auto-refreshes hourly
      </p>
    </div>
  );
}
