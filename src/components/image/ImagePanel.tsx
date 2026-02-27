'use client';

import { useImageStore } from '@/stores/useImageStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { PromptInput } from '@/components/shared/PromptInput';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { StylePresetPicker } from './StylePresetPicker';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { AdvancedImageControls } from './AdvancedImageControls';
import { stylePresets } from '@/data/style-presets';
import { canvasSizes } from '@/data/canvas-sizes';
import { generatePollinationsImage } from '@/lib/api/pollinations';
import { generateHfImage } from '@/lib/api/huggingface';
import { saveGalleryItem, generateThumbnail } from '@/lib/db';
import { randomSeed } from '@/lib/utils/seed';
import { cn } from '@/lib/utils/cn';
import { v4 as uuid } from 'uuid';
import { Download, RefreshCw, Maximize2 } from 'lucide-react';
import { downloadBlob } from '@/lib/utils/download';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function ImagePanel() {
  const store = useImageStore();
  const { hfToken, pollinationsKey, nsfwEnabled } = useSettingsStore();
  const [fullscreen, setFullscreen] = useState(false);

  const handleGenerate = async () => {
    if (!store.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (store.provider === 'pollinations' && !pollinationsKey) {
      toast.error('Pollinations API key required. Add it in Settings.');
      return;
    }

    if (store.provider === 'huggingface' && !hfToken) {
      toast.error('HuggingFace token required. Add it in Settings.');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setGeneratedImageUrl(null);
    store.setGeneratedImageBlob(null);

    const startTime = Date.now();
    const seed = store.useRandomSeed ? randomSeed() : store.seed;
    const preset = stylePresets.find((p) => p.id === store.stylePreset);
    const fullPrompt = [preset?.promptPrefix, store.prompt, preset?.promptSuffix]
      .filter(Boolean)
      .join(', ');

    const safetyNegative = 'nsfw, nude, explicit, adult, sexual';
    const baseNegative = store.negativePrompt || preset?.negativePrompt || '';
    const effectiveNegative = nsfwEnabled
      ? baseNegative
      : [baseNegative, safetyNegative].filter(Boolean).join(', ');

    try {
      let result: { url: string; blob: Blob };

      if (store.provider === 'pollinations') {
        result = await generatePollinationsImage(fullPrompt, {
          model: store.model,
          width: store.width,
          height: store.height,
          seed,
        });
      } else {
        result = await generateHfImage(fullPrompt, hfToken, {
          model: store.model,
          negativePrompt: effectiveNegative,
          width: store.width,
          height: store.height,
          guidanceScale: store.cfgScale,
          numInferenceSteps: store.steps,
        });
      }

      store.setGeneratedImageUrl(result.url);
      store.setGeneratedImageBlob(result.blob);
      if (!store.useRandomSeed) store.setSeed(seed);

      // Save to gallery
      const thumbnail = await generateThumbnail(result.blob);
      await saveGalleryItem({
        id: uuid(),
        type: 'image',
        provider: store.provider,
        modelId: store.model,
        prompt: store.prompt,
        fullPrompt,
        params: {
          prompt: store.prompt,
          negativePrompt: store.negativePrompt,
          model: store.model,
          provider: store.provider,
          width: store.width,
          height: store.height,
          cfgScale: store.cfgScale,
          steps: store.steps,
          sampler: store.sampler,
          seed,
        },
        outputBlob: result.blob,
        thumbnail,
        createdAt: Date.now(),
        durationMs: Date.now() - startTime,
        isFavorite: false,
        tags: preset ? [preset.name] : [],
      });

      toast.success(`Image generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed';
      store.setError(message);
      toast.error(message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (store.generatedImageBlob) {
      downloadBlob(store.generatedImageBlob, `ai-forge-${Date.now()}.png`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls Panel */}
      <div className="lg:w-80 xl:w-96 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)]">
        {/* Prompt */}
        <PromptInput
          value={store.prompt}
          onChange={store.setPrompt}
          onSubmit={handleGenerate}
          disabled={store.isGenerating}
        />

        {/* Model Selection */}
        <ModelSelector
          type="image"
          selectedModel={store.model}
          selectedProvider={store.provider}
          onSelect={(model, provider) => {
            store.setModel(model);
            store.setProvider(provider);
          }}
        />

        {/* Style Presets */}
        <StylePresetPicker
          selected={store.stylePreset}
          onSelect={(presetId: string) => {
            store.setStylePreset(presetId);
            const preset = stylePresets.find((p) => p.id === presetId);
            if (preset?.suggestedCfg !== undefined) {
              store.setCfgScale(preset.suggestedCfg);
              toast(`CFG scale set to ${preset.suggestedCfg} for ${preset.name}`, { icon: '🎨', duration: 2000 });
            }
          }}
        />

        {/* Canvas Size */}
        <CanvasSizeSelector
          selected={store.canvasSize}
          onSelect={(sizeId) => {
            store.setCanvasSize(sizeId);
            const size = canvasSizes.find((s) => s.id === sizeId);
            if (size && sizeId !== 'custom') {
              store.setWidth(size.width);
              store.setHeight(size.height);
            }
          }}
          customWidth={store.width}
          customHeight={store.height}
          onCustomWidthChange={store.setWidth}
          onCustomHeightChange={store.setHeight}
        />

        {/* Advanced Controls */}
        <AdvancedImageControls />

        {/* Generate Button */}
        <GenerateButton
          onClick={handleGenerate}
          isGenerating={store.isGenerating}
          disabled={!store.prompt.trim()}
        />
      </div>

      {/* Output Canvas */}
      <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
        <div className={cn(
          'relative w-full h-full flex items-center justify-center rounded-xl border border-border bg-surface/50',
          store.isGenerating && 'animate-pulse'
        )}>
          {store.generatedImageUrl ? (
            <>
              <img
                src={store.generatedImageUrl}
                alt={store.prompt}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={() => setFullscreen(true)}
              />
              {/* Image actions */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFullscreen(true)}
                  className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGenerate}
                  className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : store.isGenerating ? (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted">Generating image...</p>
            </div>
          ) : (
            <div className="text-center space-y-2 text-muted">
              <div className="w-20 h-20 rounded-xl bg-surface-hover flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-sm">Enter a prompt and click Generate</p>
              <p className="text-xs">Press Enter to generate</p>
            </div>
          )}

          {store.error && (
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {store.error}
            </div>
          )}
        </div>

        {/* Fullscreen overlay */}
        {fullscreen && store.generatedImageUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
            onClick={() => setFullscreen(false)}
          >
            <img
              src={store.generatedImageUrl}
              alt={store.prompt}
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
