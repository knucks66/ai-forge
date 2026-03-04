'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { PromptInput } from '@/components/shared/PromptInput';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { SliderControl } from '@/components/shared/SliderControl';
import { VoiceSelector } from './VoiceSelector';
import { GenreTagSelector } from './GenreTagSelector';
import { AdvancedAudioControls } from './AdvancedAudioControls';
import { AudioPlayer } from './AudioPlayer';
import { generatePollinationsAudio, generatePollinationsMusic, fetchPollinationsBalance } from '@/lib/api/pollinations';
import { saveGalleryItem } from '@/lib/db';
import { downloadBlob } from '@/lib/utils/download';
import { getVoicesForModel } from '@/data/voices';
import { genreTags, moodTags } from '@/data/audio-genres';
import { v4 as uuid } from 'uuid';
import { Download, Mic, Music2, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

export function AudioPanel() {
  const store = useAudioStore();
  const { pollinationsKey } = useSettingsStore();
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-fix voice when TTS model changes
  useEffect(() => {
    if (store.mode !== 'tts') return;
    const availableVoices = getVoicesForModel(store.model);
    if (!availableVoices.some((v) => v.id === store.voice)) {
      store.setVoice(availableVoices[0]?.id || 'alloy');
    }
  }, [store.model, store.mode]);

  const handleGenerate = async () => {
    if (!store.text.trim()) {
      toast.error(store.mode === 'tts' ? 'Please enter text to convert to speech' : 'Please describe the music you want to create');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setAudioUrl(null);
    store.setAudioBlob(null);
    store.setProgress(0);

    const startTime = Date.now();

    // Progress simulation for longer generations
    progressRef.current = setInterval(() => {
      const current = useAudioStore.getState().progress;
      useAudioStore.getState().setProgress(Math.min(current + 1, 95));
    }, store.mode === 'music' ? 3000 : 1000);

    try {
      let result: { url: string; blob: Blob };

      if (store.mode === 'tts') {
        result = await generatePollinationsAudio(store.text, store.voice, {
          model: store.model,
          format: store.format,
        });
      } else {
        // Build music prompt with genre/mood tags
        const selectedTags = [...store.genreTags];
        const tagLabels = selectedTags
          .map((id) => {
            const genre = genreTags.find((t) => t.id === id);
            if (genre) return genre.label;
            const mood = moodTags.find((t) => t.id === id);
            return mood?.label;
          })
          .filter(Boolean);

        let musicPrompt = store.text;
        if (tagLabels.length > 0) {
          musicPrompt = `${tagLabels.join(', ')} music: ${store.text}`;
        }

        result = await generatePollinationsMusic(musicPrompt, {
          model: store.model,
          duration: store.duration,
          format: store.format,
        });
      }

      store.setAudioUrl(result.url);
      store.setAudioBlob(result.blob);
      store.setProgress(100);

      // Save to gallery
      const tags: string[] = [store.mode];
      if (store.mode === 'tts') {
        tags.push(store.voice);
      } else {
        tags.push(...store.genreTags);
      }

      await saveGalleryItem({
        id: uuid(),
        type: 'audio',
        provider: store.provider,
        modelId: store.model,
        prompt: store.text,
        fullPrompt: store.text,
        params: {
          prompt: store.text,
          model: store.model,
          provider: store.provider,
          voice: store.mode === 'tts' ? store.voice : undefined,
          audioMode: store.mode,
          audioFormat: store.format,
          audioDuration: store.mode === 'music' ? store.duration : undefined,
          genreTags: store.mode === 'music' ? store.genreTags : undefined,
        },
        outputBlob: result.blob,
        createdAt: Date.now(),
        durationMs: Date.now() - startTime,
        isFavorite: false,
        tags,
      });

      toast.success(`${store.mode === 'tts' ? 'Audio' : 'Music'} generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

      // Refresh Pollinations balance
      fetchPollinationsBalance().then((result) => {
        if (result) {
          const current = useBalanceStore.getState().pollinations;
          useBalanceStore.getState().setPollinationsAccount({
            ...current,
            balance: result.balance,
          });
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : `${store.mode === 'tts' ? 'Audio' : 'Music'} generation failed`;
      store.setError(message);
      toast.error(message);
    } finally {
      if (progressRef.current) clearInterval(progressRef.current);
      store.setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (store.audioBlob) {
      const ext = store.format || 'mp3';
      const prefix = store.mode === 'music' ? 'music' : 'audio';
      downloadBlob(store.audioBlob, `ai-forge-${prefix}-${Date.now()}.${ext}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls Panel */}
      <div className="lg:w-80 xl:w-96 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)]">
        {/* Mode Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => store.setMode('tts')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              store.mode === 'tts'
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-hover text-muted hover:text-foreground'
            )}
          >
            Text to Speech
          </button>
          <button
            onClick={() => store.setMode('music')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              store.mode === 'music'
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-hover text-muted hover:text-foreground'
            )}
          >
            Music
          </button>
        </div>

        {/* Prompt Input */}
        <PromptInput
          value={store.text}
          onChange={store.setText}
          onSubmit={handleGenerate}
          disabled={store.isGenerating}
          placeholder={
            store.mode === 'tts'
              ? 'Enter text to convert to speech...'
              : 'Describe the music you want to create...'
          }
          showEnhance={store.mode === 'music'}
        />

        {/* Model Selector */}
        <ModelSelector
          type="audio"
          selectedModel={store.model}
          selectedProvider={store.provider}
          onSelect={(model, provider) => {
            store.setModel(model);
            store.setProvider(provider);
          }}
          filterTag={store.mode === 'tts' ? 'tts' : 'music'}
        />

        {/* TTS-specific controls */}
        {store.mode === 'tts' && (
          <VoiceSelector
            selected={store.voice}
            onSelect={store.setVoice}
            modelId={store.model}
            disabled={store.isGenerating}
          />
        )}

        {/* Music-specific controls */}
        {store.mode === 'music' && (
          <>
            <SliderControl
              label="Duration (seconds)"
              value={store.duration}
              onChange={store.setDuration}
              min={5}
              max={300}
              step={5}
            />
            <GenreTagSelector
              selected={store.genreTags}
              onToggle={store.toggleGenreTag}
              disabled={store.isGenerating}
            />
          </>
        )}

        {/* Advanced Settings */}
        <AdvancedAudioControls />

        {/* Generate Button */}
        <GenerateButton
          onClick={handleGenerate}
          isGenerating={store.isGenerating}
          disabled={!store.text.trim()}
          label={store.mode === 'tts' ? 'Generate Audio' : 'Generate Music'}
          loadingLabel={store.mode === 'tts' ? 'Generating Audio...' : 'Generating Music...'}
        />

        {/* Progress bar */}
        {store.isGenerating && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted">
              <span>Generating...</span>
              <span>{store.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-1000"
                style={{ width: `${store.progress}%` }}
              />
            </div>
            {store.mode === 'music' && (
              <p className="text-xs text-muted">Music generation may take a while</p>
            )}
          </div>
        )}
      </div>

      {/* Output Area */}
      <div className={cn(
        'flex-1 flex items-center justify-center rounded-xl border border-border bg-surface/50 min-h-[300px] lg:min-h-0',
        store.isGenerating && 'animate-pulse'
      )}>
        {store.audioUrl ? (
          <div className="w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="w-4 h-4 text-accent" />
                {store.mode === 'tts' ? 'Generated Audio' : 'Generated Music'}
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            <AudioPlayer url={store.audioUrl} />
          </div>
        ) : store.isGenerating ? (
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-accent mx-auto animate-spin" />
            <p className="text-sm text-muted">
              {store.mode === 'tts' ? 'Converting text to speech...' : 'Generating music...'}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2 text-muted p-4">
            {store.mode === 'tts' ? (
              <Mic className="w-12 h-12 mx-auto opacity-50" />
            ) : (
              <Music2 className="w-12 h-12 mx-auto opacity-50" />
            )}
            <p className="text-sm">
              {store.mode === 'tts'
                ? 'Enter text and select a voice to generate speech'
                : 'Describe the music you want to create'}
            </p>
          </div>
        )}

        {store.error && !store.audioUrl && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 m-4">
            {store.error}
          </div>
        )}
      </div>
    </div>
  );
}
