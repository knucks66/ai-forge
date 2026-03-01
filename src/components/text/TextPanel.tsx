'use client';

import { useTextStore } from '@/stores/useTextStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { SliderControl } from '@/components/shared/SliderControl';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { SystemPromptInput } from './SystemPromptInput';
import { generatePollinationsText, fetchPollinationsBalance } from '@/lib/api/pollinations';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { generateHfText } from '@/lib/api/huggingface';
import { generateGoogleText } from '@/lib/api/google';
import { v4 as uuid } from 'uuid';
import { Trash2, ChevronDown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function TextPanel() {
  const store = useTextStore();
  const { hfToken, pollinationsKey, googleApiKey } = useSettingsStore();
  const [showControls, setShowControls] = useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim() || store.isGenerating) return;

    if (store.provider === 'huggingface' && !hfToken) {
      toast.error('HuggingFace token required. Add it in Settings.');
      return;
    }

    if (store.provider === 'google' && !googleApiKey) {
      toast.error('Google API key required. Add it in Settings.');
      return;
    }

    // Add user message
    store.addMessage({
      id: uuid(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    });

    // Add placeholder assistant message
    store.addMessage({
      id: uuid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: store.model,
    });

    store.setIsGenerating(true);
    store.setError(null);

    try {
      const messages = [
        ...(store.systemPrompt ? [{ role: 'system', content: store.systemPrompt }] : []),
        ...store.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: content.trim() },
      ];

      let response: Response;

      if (store.provider === 'pollinations') {
        response = await generatePollinationsText(messages, {
          model: store.model,
          temperature: store.temperature,
          maxTokens: store.maxTokens,
          topP: store.topP,
          stream: true,
        });
      } else if (store.provider === 'google') {
        response = await generateGoogleText(messages, googleApiKey, {
          model: store.model,
          temperature: store.temperature,
          maxTokens: store.maxTokens,
          topP: store.topP,
        });
      } else {
        response = await generateHfText(messages, hfToken, {
          model: store.model,
          temperature: store.temperature,
          maxTokens: store.maxTokens,
          topP: store.topP,
        });
      }

      // Parse streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              const content = parsed.choices?.[0]?.delta?.content || parsed.content || '';
              if (content) {
                fullContent += content;
                store.updateLastAssistantMessage(fullContent);
              }
            } catch (e) {
              // If it's not JSON, it might be raw text from Pollinations
              if (!data.startsWith('{')) {
                fullContent += data;
                store.updateLastAssistantMessage(fullContent);
              }
            }
          }
        }
      }

      // If no streaming content was received, try parsing as plain text
      if (!fullContent && response.headers.get('content-type')?.includes('text/plain')) {
        fullContent = await response.text();
        store.updateLastAssistantMessage(fullContent);
      }
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
      store.updateLastAssistantMessage(`Error: ${message}`);
      toast.error(message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Top controls bar */}
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
        <div className="flex-1">
          <ModelSelector
            type="text"
            selectedModel={store.model}
            selectedProvider={store.provider}
            onSelect={(model, provider) => {
              store.setModel(model);
              store.setProvider(provider);
            }}
          />
        </div>
        <button
          onClick={() => setShowControls(!showControls)}
          className={cn(
            'p-2 rounded-lg transition-colors mt-5',
            showControls ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground hover:bg-surface-hover'
          )}
          title="Generation settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => { store.clearMessages(); toast.success('Chat cleared'); }}
          className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-surface-hover transition-colors mt-5"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Controls drawer */}
      {showControls && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 mb-3 border-b border-border animate-fade-in">
          <SliderControl label="Temperature" value={store.temperature} onChange={store.setTemperature} min={0} max={2} step={0.1} />
          <SliderControl label="Max Tokens" value={store.maxTokens} onChange={store.setMaxTokens} min={64} max={8192} step={64} />
          <SliderControl label="Top P" value={store.topP} onChange={store.setTopP} min={0} max={1} step={0.05} />
        </div>
      )}

      {/* System Prompt */}
      <SystemPromptInput />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={store.messages} isGenerating={store.isGenerating} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={store.isGenerating} />
    </div>
  );
}
