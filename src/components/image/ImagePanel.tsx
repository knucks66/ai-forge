'use client';

import { useImageStore } from '@/stores/useImageStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { PromptInput } from '@/components/shared/PromptInput';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { ImageDropZone } from '@/components/shared/ImageDropZone';
import { SliderControl } from '@/components/shared/SliderControl';
import { StylePresetPicker } from './StylePresetPicker';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { AdvancedImageControls } from './AdvancedImageControls';
import { stylePresets } from '@/data/style-presets';
import { canvasSizes } from '@/data/canvas-sizes';
import { generatePollinationsImage, generatePollinationsImageToImage, fetchPollinationsBalance } from '@/lib/api/pollinations';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { generateHfImage, generateHfImageToImage } from '@/lib/api/huggingface';
import { generateGoogleImage } from '@/lib/api/google';
import { generateOpenRouterImage } from '@/lib/api/openrouter';
import { saveGalleryItem, generateThumbnail } from '@/lib/db';
import { randomSeed } from '@/lib/utils/seed';
import { cn } from '@/lib/utils/cn';
import { v4 as uuid } from 'uuid';
import { Download, RefreshCw, Maximize2, Wand2, Upload, ShieldAlert } from 'lucide-react';
import { downloadBlob } from '@/lib/utils/download';
import toast from 'react-hot-toast';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useModels } from '@/lib/hooks/useModels';
import { validateImageFile } from '@/lib/utils/image';
import { detectNsfwPrompt, isNsfwPreset } from '@/lib/utils/nsfw-detect';

export function ImagePanel() {
  const store = useImageStore();
  const { hfToken, pollinationsKey, googleApiKey, openRouterApiKey, nsfwEnabled, setNsfwEnabled } = useSettingsStore();
  const { imageModels } = useModels();
  const [fullscreen, setFullscreen] = useState(false);
  const prevMode = useRef(store.mode);

  // Auto-select compatible model when entering image-to-image mode
  useEffect(() => {
    if (store.mode === 'image-to-image' && prevMode.current !== 'image-to-image') {
      const compatible = imageModels.filter((m) => m.capabilities?.supportsImageInput);
      const currentIsCompatible = compatible.some(
        (m) => m.id === store.model && m.provider === store.provider
      );

      if (!currentIsCompatible && compatible.length > 0) {
        // Try last used img2img model first
        const lastUsed = store.lastImg2ImgModel && store.lastImg2ImgProvider
          ? compatible.find((m) => m.id === store.lastImg2ImgModel && m.provider === store.lastImg2ImgProvider)
          : null;

        const pick = lastUsed || compatible[0];
        store.setModel(pick.id);
        store.setProvider(pick.provider);
      }
    }
    prevMode.current = store.mode;
  }, [store.mode, imageModels]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error!);
        return;
      }
      const url = URL.createObjectURL(file);
      store.setInputImage(url, file);
    }
  }, [store]);

  const handleGenerate = async () => {
    if (!store.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (store.provider === 'pollinations' && !pollinationsKey) {
      toast.error('Pollinations API key required for image generation. Add it in Settings.');
      return;
    }

    if (store.provider === 'huggingface' && !hfToken) {
      toast.error('HuggingFace token required. Add it in Settings.');
      return;
    }

    if (store.provider === 'google' && !googleApiKey) {
      toast.error('Google API key required. Add it in Settings.');
      return;
    }

    if (store.provider === 'openrouter' && !openRouterApiKey) {
      toast.error('OpenRouter API key required. Add it in Settings.');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setGeneratedImageUrl(null);
    store.setGeneratedImageBlob(null);
    store.setNsfwDetected(false);
    store.setNsfwRevealed(false);

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

      if (store.mode === 'image-to-image' && store.inputImageBlob) {
        // Image-to-image generation
        if (store.provider === 'pollinations') {
          result = await generatePollinationsImageToImage(fullPrompt, store.inputImageBlob, {
            model: store.model,
            width: store.width,
            height: store.height,
            seed,
            negative_prompt: effectiveNegative || undefined,
          });
        } else {
          result = await generateHfImageToImage(fullPrompt, store.inputImageBlob, hfToken, {
            model: store.model,
            negativePrompt: effectiveNegative,
            strength: store.strength,
            guidanceScale: store.cfgScale,
            numInferenceSteps: store.steps,
          });
        }
      } else {
        // Text-to-image generation (original logic)
        if (store.provider === 'pollinations') {
          result = await generatePollinationsImage(fullPrompt, {
            model: store.model,
            width: store.width,
            height: store.height,
            seed,
          });
        } else if (store.provider === 'google') {
          result = await generateGoogleImage(fullPrompt, googleApiKey, {
            model: store.model,
          });
        } else if (store.provider === 'openrouter') {
          result = await generateOpenRouterImage(fullPrompt, openRouterApiKey, {
            model: store.model,
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
      }

      store.setGeneratedImageUrl(result.url);
      store.setGeneratedImageBlob(result.blob);
      if (!store.useRandomSeed) store.setSeed(seed);
      if (store.mode === 'image-to-image') {
        store.setLastImg2ImgModel(store.model, store.provider);
      }

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
          strength: store.mode === 'image-to-image' ? store.strength : undefined,
        },
        outputBlob: result.blob,
        thumbnail,
        inputImageBlob: store.mode === 'image-to-image' ? store.inputImageBlob ?? undefined : undefined,
        createdAt: Date.now(),
        durationMs: Date.now() - startTime,
        isFavorite: false,
        tags: preset ? [preset.name] : [],
      });

      // Detect NSFW content from prompt/preset
      const isNsfw = detectNsfwPrompt(fullPrompt) || isNsfwPreset(store.stylePreset, stylePresets);
      store.setNsfwDetected(isNsfw);
      store.setNsfwRevealed(false);

      toast.success(`Image generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

      // Refresh Pollinations balance after generation
      if (store.provider === 'pollinations') {
        fetchPollinationsBalance().then((result) => {
          if (result) {
            const current = useBalanceStore.getState().pollinations;
            useBalanceStore.getState().setPollinationsAccount({
              ...current,
              balance: result.balance,
            });
          }
        });
      }
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
        {/* Mode indicator */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            store.mode === 'image-to-image'
              ? 'bg-accent/15 text-accent'
              : 'bg-surface-hover text-muted'
          )}>
            {store.mode === 'image-to-image' ? 'Image-to-Image' : 'Text-to-Image'}
          </span>
        </div>

        {/* Image Drop Zone */}
        <ImageDropZone
          imageUrl={store.inputImageUrl}
          onImageSet={(url, blob) => store.setInputImage(url, blob)}
          onImageClear={() => store.clearInputImage()}
          disabled={store.isGenerating}
        />

        {/* Strength slider (img2img only) */}
        {store.mode === 'image-to-image' && (
          <SliderControl
            label="Strength"
            value={store.strength}
            onChange={store.setStrength}
            min={0}
            max={1}
            step={0.05}
          />
        )}

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
          requiredCapability={
            store.mode === 'image-to-image' ? 'supportsImageInput' : undefined
          }
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
          label={store.mode === 'image-to-image' ? 'Edit Image' : 'Generate'}
        />
      </div>

      {/* Output Canvas */}
      <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
        <div className={cn(
          'relative w-full h-full flex items-center justify-center rounded-xl border border-border bg-surface/50',
          store.isGenerating && 'animate-pulse'
        )}>
          {store.generatedImageUrl ? (() => {
            const isBlurred = store.nsfwDetected && !nsfwEnabled && !store.nsfwRevealed;
            return (
              <>
                <div className="relative max-w-full max-h-full">
                  <img
                    src={store.generatedImageUrl}
                    alt={store.prompt}
                    className={cn(
                      'max-w-full max-h-full object-contain rounded-lg',
                      isBlurred && 'blur-xl scale-[1.02]'
                    )}
                    onClick={() => {
                      if (!isBlurred) setFullscreen(true);
                    }}
                  />
                  {/* NSFW overlay */}
                  {isBlurred && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 rounded-lg">
                      <ShieldAlert className="w-10 h-10 text-yellow-500" />
                      <p className="text-sm text-white font-medium">This image may contain adult content</p>
                      <button
                        onClick={() => {
                          setNsfwEnabled(true);
                          store.setNsfwRevealed(true);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                      >
                        Enable NSFW to view
                      </button>
                    </div>
                  )}
                </div>
                {/* Image actions - only show when not blurred */}
                {!isBlurred && (
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
                      onClick={() => store.refineCurrentImage()}
                      className="p-2 rounded-lg bg-black/50 text-white hover:bg-accent/70 transition-colors"
                      title="Refine this image"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            );
          })() : store.isGenerating ? (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted">
                {store.mode === 'image-to-image' ? 'Editing image...' : 'Generating image...'}
              </p>
            </div>
          ) : (
            <div
              className="text-center space-y-2 text-muted w-full h-full flex flex-col items-center justify-center"
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleCanvasDrop}
            >
              <div className="w-20 h-20 rounded-xl bg-surface-hover flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm">Enter a prompt and click Generate</p>
              <p className="text-xs">Drop an image here to edit it, or press Enter to generate</p>
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
