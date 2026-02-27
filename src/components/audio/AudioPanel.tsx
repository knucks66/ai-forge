'use client';

import { useAudioStore } from '@/stores/useAudioStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { VoiceSelector } from './VoiceSelector';
import { AudioPlayer } from './AudioPlayer';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { generatePollinationsAudio } from '@/lib/api/pollinations';
import { saveGalleryItem } from '@/lib/db';
import { downloadBlob } from '@/lib/utils/download';
import { v4 as uuid } from 'uuid';
import { Download, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

export function AudioPanel() {
  const store = useAudioStore();
  const { pollinationsKey } = useSettingsStore();

  const handleGenerate = async () => {
    if (!store.text.trim()) {
      toast.error('Please enter text to convert to speech');
      return;
    }

    if (!pollinationsKey) {
      toast.error('Pollinations API key required. Add it in Settings.');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setAudioUrl(null);
    store.setAudioBlob(null);

    const startTime = Date.now();

    try {
      const result = await generatePollinationsAudio(store.text, store.voice);
      store.setAudioUrl(result.url);
      store.setAudioBlob(result.blob);

      // Save to gallery
      await saveGalleryItem({
        id: uuid(),
        type: 'audio',
        provider: 'pollinations',
        modelId: store.model,
        prompt: store.text,
        fullPrompt: store.text,
        params: {
          prompt: store.text,
          model: store.model,
          provider: 'pollinations',
          voice: store.voice,
        },
        outputBlob: result.blob,
        createdAt: Date.now(),
        durationMs: Date.now() - startTime,
        isFavorite: false,
        tags: [store.voice],
      });

      toast.success(`Audio generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Audio generation failed';
      store.setError(message);
      toast.error(message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (store.audioBlob) {
      downloadBlob(store.audioBlob, `ai-forge-audio-${Date.now()}.mp3`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Text Input */}
      <div>
        <label className="text-sm font-medium text-muted mb-2 block">Text to Speech</label>
        <textarea
          value={store.text}
          onChange={(e) => store.setText(e.target.value)}
          placeholder="Enter the text you want to convert to speech..."
          rows={5}
          disabled={store.isGenerating}
          className={cn(
            'w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none',
            'focus:outline-none focus:border-accent placeholder:text-muted/60',
            store.isGenerating && 'opacity-50'
          )}
        />
        <p className="text-xs text-muted mt-1">{store.text.length} characters</p>
      </div>

      {/* Voice Selector */}
      <VoiceSelector
        selected={store.voice}
        onSelect={store.setVoice}
      />

      {/* Generate Button */}
      <GenerateButton
        onClick={handleGenerate}
        isGenerating={store.isGenerating}
        disabled={!store.text.trim()}
        label="Generate Audio"
        loadingLabel="Generating Audio..."
      />

      {/* Error */}
      {store.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {store.error}
        </div>
      )}

      {/* Audio Player */}
      {store.audioUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="w-4 h-4 text-accent" />
              Generated Audio
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
      )}
    </div>
  );
}
