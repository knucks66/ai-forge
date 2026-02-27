'use client';

import { useVideoStore } from '@/stores/useVideoStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { PromptInput } from '@/components/shared/PromptInput';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { generateHfVideo } from '@/lib/api/huggingface';
import { saveGalleryItem } from '@/lib/db';
import { downloadBlob } from '@/lib/utils/download';
import { v4 as uuid } from 'uuid';
import { Download, AlertTriangle, Film } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

export function VideoPanel() {
  const store = useVideoStore();
  const { hfToken } = useSettingsStore();

  const handleGenerate = async () => {
    if (!store.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!hfToken) {
      toast.error('HuggingFace token required for video generation. Add it in Settings.');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setVideoUrl(null);
    store.setVideoBlob(null);
    store.setProgress(0);

    const startTime = Date.now();

    // Progress simulation (since we can't get real progress from HF API)
    // Use getState() to read the current progress value since setProgress expects a number
    const progressInterval = setInterval(() => {
      const current = useVideoStore.getState().progress;
      useVideoStore.getState().setProgress(Math.min(current + 1, 95));
    }, 3000);

    try {
      const result = await generateHfVideo(store.prompt, hfToken, store.model);
      store.setVideoUrl(result.url);
      store.setVideoBlob(result.blob);
      store.setProgress(100);

      // Save to gallery
      await saveGalleryItem({
        id: uuid(),
        type: 'video',
        provider: 'huggingface',
        modelId: store.model,
        prompt: store.prompt,
        fullPrompt: store.prompt,
        params: {
          prompt: store.prompt,
          model: store.model,
          provider: 'huggingface',
        },
        outputBlob: result.blob,
        createdAt: Date.now(),
        durationMs: Date.now() - startTime,
        isFavorite: false,
        tags: ['video'],
      });

      toast.success(`Video generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Video generation failed';
      store.setError(message);
      toast.error(message);
    } finally {
      clearInterval(progressInterval);
      store.setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (store.videoBlob) {
      downloadBlob(store.videoBlob, `ai-forge-video-${Date.now()}.mp4`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Experimental warning */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-400">Experimental Feature</p>
          <p className="text-xs text-muted mt-1">
            Video generation uses HuggingFace models and may take several minutes. Results vary by model and may have limited quality. A HuggingFace token is required.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <PromptInput
            value={store.prompt}
            onChange={store.setPrompt}
            onSubmit={handleGenerate}
            disabled={store.isGenerating}
            placeholder="Describe the video you want to generate..."
            showEnhance={false}
          />

          <ModelSelector
            type="video"
            selectedModel={store.model}
            selectedProvider="huggingface"
            onSelect={(model) => store.setModel(model)}
          />

          <GenerateButton
            onClick={handleGenerate}
            isGenerating={store.isGenerating}
            disabled={!store.prompt.trim() || !hfToken}
            label="Generate Video"
            loadingLabel="Generating Video..."
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
              <p className="text-xs text-muted">This may take up to 5 minutes</p>
            </div>
          )}
        </div>

        {/* Video output */}
        <div className={cn(
          'flex items-center justify-center rounded-xl border border-border bg-surface/50 min-h-[300px]',
          store.isGenerating && 'animate-pulse'
        )}>
          {store.videoUrl ? (
            <div className="w-full p-4 space-y-3">
              <video
                src={store.videoUrl}
                controls
                autoPlay
                loop
                className="w-full rounded-lg"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/15 text-accent hover:bg-accent/25 transition-colors mx-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download Video
              </button>
            </div>
          ) : store.isGenerating ? (
            <div className="text-center space-y-3">
              <Film className="w-12 h-12 text-muted mx-auto animate-pulse" />
              <p className="text-sm text-muted">Generating video...</p>
              <p className="text-xs text-muted">Please be patient, this takes a while</p>
            </div>
          ) : (
            <div className="text-center space-y-2 text-muted p-4">
              <Film className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm">Enter a prompt to generate a video</p>
              <p className="text-xs">Requires a HuggingFace token</p>
            </div>
          )}

          {store.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 m-4">
              {store.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
