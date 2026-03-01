'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAppStore } from '@/stores/useAppStore';
import { X, Eye, EyeOff, CheckCircle, XCircle, Loader2, Key, Palette, Wallet, RefreshCw } from 'lucide-react';
import { useBalance } from '@/lib/hooks/useBalance';
import { formatCredits } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

interface SettingsDialogProps {
  onClose: () => void;
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { hfToken, pollinationsKey, googleApiKey, setHfToken, setPollinationsKey, setGoogleApiKey } = useSettingsStore();
  const { theme, setTheme } = useAppStore();
  const [showHfToken, setShowHfToken] = useState(false);
  const [showPollKey, setShowPollKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [testingHf, setTestingHf] = useState(false);
  const [testingPoll, setTestingPoll] = useState(false);
  const [testingGoogle, setTestingGoogle] = useState(false);
  const [hfStatus, setHfStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pollStatus, setPollStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    pollinations: pollAccount,
    huggingface: hfAccount,
    google: googleAccount,
    isLoadingPollinations,
    isLoadingHuggingface,
    refreshAll,
  } = useBalance();

  const testHfConnection = async () => {
    if (!hfToken) {
      toast.error('Please enter a HuggingFace token first');
      return;
    }
    setTestingHf(true);
    setHfStatus('idle');
    try {
      const res = await fetch('https://huggingface.co/api/whoami-v2', {
        headers: { Authorization: `Bearer ${hfToken}` },
      });
      if (res.ok) {
        setHfStatus('success');
        toast.success('HuggingFace connection successful!');
      } else {
        setHfStatus('error');
        toast.error('Invalid HuggingFace token');
      }
    } catch {
      setHfStatus('error');
      toast.error('Connection test failed');
    } finally {
      setTestingHf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-muted hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* API Keys Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-accent" />
              <h3 className="font-medium">API Keys</h3>
            </div>

            {/* HuggingFace Token */}
            <div className="space-y-2 mb-4">
              <label className="text-sm text-muted">HuggingFace Token</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showHfToken ? 'text' : 'password'}
                    value={hfToken}
                    onChange={(e) => { setHfToken(e.target.value); setHfStatus('idle'); }}
                    placeholder="hf_..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent pr-10"
                  />
                  <button
                    onClick={() => setShowHfToken(!showHfToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showHfToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={testHfConnection}
                  disabled={testingHf || !hfToken}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                    'bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-50'
                  )}
                >
                  {testingHf ? <Loader2 className="w-4 h-4 animate-spin" /> :
                    hfStatus === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                    hfStatus === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                  Test
                </button>
              </div>
              <p className="text-xs text-muted">
                Required for HuggingFace models. Get yours at{' '}
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  huggingface.co/settings/tokens
                </a>
              </p>
            </div>

            {/* Pollinations Key */}
            <div className="space-y-2">
              <label className="text-sm text-muted">Pollinations API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPollKey ? 'text' : 'password'}
                    value={pollinationsKey}
                    onChange={(e) => { setPollinationsKey(e.target.value); setPollStatus('idle'); }}
                    placeholder="pk_... or sk_..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent pr-10"
                  />
                  <button
                    onClick={() => setShowPollKey(!showPollKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showPollKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={async () => {
                    setTestingPoll(true);
                    setPollStatus('idle');
                    try {
                      const headers: Record<string, string> = {};
                      if (pollinationsKey) headers['Authorization'] = `Bearer ${pollinationsKey}`;
                      const res = await fetch('https://gen.pollinations.ai/models', { headers });
                      if (res.ok) {
                        setPollStatus('success');
                        toast.success('Pollinations connection successful!');
                      } else {
                        setPollStatus('error');
                        toast.error('Pollinations connection failed');
                      }
                    } catch {
                      setPollStatus('error');
                      toast.error('Connection test failed');
                    } finally {
                      setTestingPoll(false);
                    }
                  }}
                  disabled={testingPoll || !pollinationsKey}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                    'bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-50'
                  )}
                >
                  {testingPoll ? <Loader2 className="w-4 h-4 animate-spin" /> :
                    pollStatus === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                    pollStatus === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                  Test
                </button>
              </div>
              <p className="text-xs text-muted">
                Required for Pollinations models. Get yours at{' '}
                <a href="https://auth.pollinations.ai/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  auth.pollinations.ai
                </a>
              </p>
            </div>

            {/* Google API Key */}
            <div className="space-y-2">
              <label className="text-sm text-muted">Google AI Studio API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showGoogleKey ? 'text' : 'password'}
                    value={googleApiKey}
                    onChange={(e) => { setGoogleApiKey(e.target.value); setGoogleStatus('idle'); }}
                    placeholder="AIza..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent pr-10"
                  />
                  <button
                    onClick={() => setShowGoogleKey(!showGoogleKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showGoogleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={async () => {
                    if (!googleApiKey) {
                      toast.error('Please enter a Google API key first');
                      return;
                    }
                    setTestingGoogle(true);
                    setGoogleStatus('idle');
                    try {
                      const res = await fetch('/api/google/text', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-google-api-key': googleApiKey,
                        },
                        body: JSON.stringify({
                          messages: [{ role: 'user', content: 'Hi' }],
                          model: 'gemini-2.5-flash',
                          maxTokens: 16,
                        }),
                      });
                      if (res.ok) {
                        // SSE stream started — read first chunk to verify no error inside
                        const reader = res.body?.getReader();
                        if (reader) {
                          const { value } = await reader.read();
                          reader.cancel();
                          const text = value ? new TextDecoder().decode(value) : '';
                          if (text.includes('"error"')) {
                            setGoogleStatus('error');
                            toast.error('Google AI returned an error. Check your API key.');
                            return;
                          }
                        }
                        setGoogleStatus('success');
                        toast.success('Google AI connection successful!');
                      } else if (res.status === 429) {
                        // Rate limited — key is valid but quota exceeded
                        setGoogleStatus('success');
                        toast.success('Google AI key is valid! (Currently rate limited — wait a moment before generating)');
                      } else {
                        setGoogleStatus('error');
                        const data = await res.json().catch(() => null);
                        const msg = data?.error;
                        if (msg?.includes('API key not valid')) {
                          toast.error('Invalid Google API key');
                        } else {
                          toast.error(msg || 'Google AI connection failed');
                        }
                      }
                    } catch {
                      setGoogleStatus('error');
                      toast.error('Connection test failed');
                    } finally {
                      setTestingGoogle(false);
                    }
                  }}
                  disabled={testingGoogle || !googleApiKey}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                    'bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-50'
                  )}
                >
                  {testingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> :
                    googleStatus === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                    googleStatus === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                  Test
                </button>
              </div>
              <p className="text-xs text-muted">
                Required for Google AI models. Get yours at{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  aistudio.google.com/apikey
                </a>
              </p>
            </div>
          </section>

          {/* Account Status Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-accent" />
                <h3 className="font-medium">Account Status</h3>
              </div>
              <button
                onClick={refreshAll}
                disabled={isLoadingPollinations || isLoadingHuggingface}
                className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {(isLoadingPollinations || isLoadingHuggingface) ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Refresh
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {/* Pollinations row */}
              <div className="flex items-center justify-between px-3 py-2 bg-background rounded-lg border border-border">
                <span className="text-muted">Pollinations</span>
                <span className="text-foreground">
                  {!pollinationsKey
                    ? <span className="text-muted text-xs">No API key set</span>
                    : isLoadingPollinations
                    ? <Loader2 className="w-3 h-3 animate-spin inline" />
                    : pollAccount
                    ? <>{formatCredits(pollAccount.balance)} credits{pollAccount.tier ? ` · ${pollAccount.tier} tier` : ''}</>
                    : <span className="text-red-400 text-xs">Unable to fetch</span>
                  }
                </span>
              </div>
              {/* HuggingFace row */}
              <div className="flex items-center justify-between px-3 py-2 bg-background rounded-lg border border-border">
                <span className="text-muted">HuggingFace</span>
                <span className="text-foreground">
                  {!hfToken
                    ? <span className="text-muted text-xs">No token set</span>
                    : isLoadingHuggingface
                    ? <Loader2 className="w-3 h-3 animate-spin inline" />
                    : hfAccount
                    ? <>{hfAccount.username} · {hfAccount.plan}</>
                    : <span className="text-red-400 text-xs">Unable to fetch</span>
                  }
                </span>
              </div>
              {/* Google row */}
              <div className="flex items-center justify-between px-3 py-2 bg-background rounded-lg border border-border">
                <span className="text-muted">Google AI</span>
                <span className="text-foreground">
                  {!googleApiKey
                    ? <span className="text-muted text-xs">No API key set</span>
                    : googleAccount
                    ? <span className="text-green-400 text-xs">Free tier (rate limited)</span>
                    : <span className="text-muted text-xs">Key set</span>
                  }
                </span>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-accent" />
              <h3 className="font-medium">Appearance</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                  theme === 'dark' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-foreground'
                )}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                  theme === 'light' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-foreground'
                )}
              >
                Light
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
