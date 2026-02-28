'use client';

import { useState } from 'react';
import { PromptInput } from '@/components/shared/PromptInput';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { ComparisonSlot } from './ComparisonSlot';
import { cn } from '@/lib/utils/cn';
import { Image, MessageSquare, Music } from 'lucide-react';
import { GenerationType, Provider } from '@/types/generation';
import { generatePollinationsImage } from '@/lib/api/pollinations';
import { generateHfImage } from '@/lib/api/huggingface';
import { generatePollinationsText } from '@/lib/api/pollinations';
import { generateHfText } from '@/lib/api/huggingface';
import { useSettingsStore } from '@/stores/useSettingsStore';
import toast from 'react-hot-toast';

type CompareMode = 'image' | 'text' | 'audio';

interface SlotState {
  model: string;
  provider: Provider;
  isGenerating: boolean;
  result: string | null;
  resultBlob: Blob | null;
  textContent: string;
  error: string | null;
}

const defaultSlot = (model: string = 'flux', provider: Provider = 'pollinations'): SlotState => ({
  model,
  provider,
  isGenerating: false,
  result: null,
  resultBlob: null,
  textContent: '',
  error: null,
});

export function ComparisonPanel() {
  const { hfToken, pollinationsKey } = useSettingsStore();
  const [mode, setMode] = useState<CompareMode>('image');
  const [prompt, setPrompt] = useState('');
  const [slotA, setSlotA] = useState<SlotState>(defaultSlot('flux', 'pollinations'));
  const [slotB, setSlotB] = useState<SlotState>(defaultSlot('flux-realism', 'pollinations'));

  const isGenerating = slotA.isGenerating || slotB.isGenerating;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Reset results
    setSlotA((s) => ({ ...s, isGenerating: true, result: null, resultBlob: null, textContent: '', error: null }));
    setSlotB((s) => ({ ...s, isGenerating: true, result: null, resultBlob: null, textContent: '', error: null }));

    const generateSlot = async (slot: SlotState, setSlot: React.Dispatch<React.SetStateAction<SlotState>>) => {
      try {
        if (mode === 'image') {
          if (slot.provider === 'pollinations') {
            if (!pollinationsKey) throw new Error('Pollinations API key required. Add it in Settings.');
            const result = await generatePollinationsImage(prompt, { model: slot.model });
            setSlot((s) => ({ ...s, result: result.url, resultBlob: result.blob, isGenerating: false }));
          } else {
            if (!hfToken) throw new Error('HuggingFace token required');
            const result = await generateHfImage(prompt, hfToken, { model: slot.model });
            setSlot((s) => ({ ...s, result: result.url, resultBlob: result.blob, isGenerating: false }));
          }
        } else if (mode === 'text') {
          const messages = [{ role: 'user', content: prompt }];
          let response: Response;
          if (slot.provider === 'pollinations') {
            response = await generatePollinationsText(messages, { model: slot.model, stream: false });
          } else {
            if (!hfToken) throw new Error('HuggingFace token required');
            response = await generateHfText(messages, hfToken, { model: slot.model });
          }
          const text = await response.text();
          setSlot((s) => ({ ...s, textContent: text, isGenerating: false }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Generation failed';
        setSlot((s) => ({ ...s, error: message, isGenerating: false }));
      }
    };

    // Fire both requests concurrently
    await Promise.allSettled([
      generateSlot(slotA, setSlotA),
      generateSlot(slotB, setSlotB),
    ]);
  };

  const modeOptions = [
    { mode: 'image' as CompareMode, icon: Image, label: 'Image' },
    { mode: 'text' as CompareMode, icon: MessageSquare, label: 'Text' },
    { mode: 'audio' as CompareMode, icon: Music, label: 'Audio' },
  ];

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex items-center gap-2">
        {modeOptions.map(({ mode: m, icon: Icon, label }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              mode === m
                ? 'bg-accent/15 text-accent'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Shared prompt */}
      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleGenerate}
        disabled={isGenerating}
        placeholder={`Enter a prompt to compare ${mode} generation...`}
      />

      {/* Generate Both button */}
      <GenerateButton
        onClick={handleGenerate}
        isGenerating={isGenerating}
        disabled={!prompt.trim()}
        label="Generate Both"
        loadingLabel="Generating..."
      />

      {/* Comparison slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComparisonSlot
          label="Model A"
          mode={mode}
          model={slotA.model}
          provider={slotA.provider}
          onModelChange={(model, provider) => setSlotA((s) => ({ ...s, model, provider }))}
          isGenerating={slotA.isGenerating}
          resultUrl={slotA.result}
          textContent={slotA.textContent}
          error={slotA.error}
        />
        <ComparisonSlot
          label="Model B"
          mode={mode}
          model={slotB.model}
          provider={slotB.provider}
          onModelChange={(model, provider) => setSlotB((s) => ({ ...s, model, provider }))}
          isGenerating={slotB.isGenerating}
          resultUrl={slotB.result}
          textContent={slotB.textContent}
          error={slotB.error}
        />
      </div>
    </div>
  );
}
