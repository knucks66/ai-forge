import { ModelOption } from '@/types/models';

export const defaultImageModels: ModelOption[] = [
  { id: 'flux', name: 'FLUX.1', provider: 'pollinations', type: 'image', tags: ['fast', 'quality'] },
  { id: 'flux-realism', name: 'FLUX Realism', provider: 'pollinations', type: 'image', tags: ['realistic'] },
  { id: 'flux-anime', name: 'FLUX Anime', provider: 'pollinations', type: 'image', tags: ['anime'] },
  { id: 'flux-3d', name: 'FLUX 3D', provider: 'pollinations', type: 'image', tags: ['3d'] },
  { id: 'flux-cablyai', name: 'FLUX CablyAI', provider: 'pollinations', type: 'image', tags: ['artistic'] },
  { id: 'turbo', name: 'Turbo', provider: 'pollinations', type: 'image', tags: ['fast'] },
  { id: 'kontext', name: 'Kontext', provider: 'pollinations', type: 'image', tags: ['editing'], capabilities: { supportsImageInput: true } },
  { id: 'klein', name: 'Klein', provider: 'pollinations', type: 'image', tags: ['editing'], capabilities: { supportsImageInput: true } },
  { id: 'klein-large', name: 'Klein Large', provider: 'pollinations', type: 'image', tags: ['editing', 'large'], capabilities: { supportsImageInput: true } },
  { id: 'gptimage', name: 'GPT Image', provider: 'pollinations', type: 'image', tags: ['openai'], capabilities: { supportsImageInput: true } },
  { id: 'gptimage-large', name: 'GPT Image Large', provider: 'pollinations', type: 'image', tags: ['openai', 'large'], capabilities: { supportsImageInput: true } },
  { id: 'seedream', name: 'Seedream', provider: 'pollinations', type: 'image', tags: ['creative'], capabilities: { supportsImageInput: true } },
  { id: 'seedream-pro', name: 'Seedream Pro', provider: 'pollinations', type: 'image', tags: ['creative', 'pro'], capabilities: { supportsImageInput: true } },
  { id: 'nanobanana', name: 'NanoBanana', provider: 'pollinations', type: 'image', tags: ['fast'], capabilities: { supportsImageInput: true } },
  { id: 'nanobanana-pro', name: 'NanoBanana Pro', provider: 'pollinations', type: 'image', tags: ['fast', 'pro'], capabilities: { supportsImageInput: true } },
  { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL 1.0', provider: 'huggingface', type: 'image', tags: ['stable-diffusion'] },
  { id: 'stabilityai/stable-diffusion-3-medium-diffusers', name: 'SD 3 Medium', provider: 'huggingface', type: 'image', tags: ['stable-diffusion'] },
  { id: 'black-forest-labs/FLUX.1-dev', name: 'FLUX.1 Dev', provider: 'huggingface', type: 'image', tags: ['flux'] },
  { id: 'black-forest-labs/FLUX.1-schnell', name: 'FLUX.1 Schnell', provider: 'huggingface', type: 'image', tags: ['flux', 'fast'] },
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', provider: 'google', type: 'image', tags: ['google', 'fast'] },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image', provider: 'google', type: 'image', tags: ['google', 'quality'] },
  { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash Image', provider: 'google', type: 'image', tags: ['google', 'fast', 'new'] },
  { id: 'google/gemini-2.5-flash-image-preview:free', name: 'Gemini Flash Image (OpenRouter)', provider: 'openrouter', type: 'image', tags: ['google', 'free'] },
];

export const defaultTextModels: ModelOption[] = [
  { id: 'openai', name: 'GPT-4o Mini', provider: 'pollinations', type: 'text', tags: ['openai'] },
  { id: 'openai-large', name: 'GPT-4o', provider: 'pollinations', type: 'text', tags: ['openai', 'large'] },
  { id: 'mistral', name: 'Mistral', provider: 'pollinations', type: 'text', tags: ['open-source'] },
  { id: 'llama', name: 'Llama 3.3', provider: 'pollinations', type: 'text', tags: ['meta', 'open-source'] },
  { id: 'deepseek', name: 'DeepSeek V3', provider: 'pollinations', type: 'text', tags: ['deepseek'] },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'pollinations', type: 'text', tags: ['deepseek', 'reasoning'] },
  { id: 'qwen', name: 'Qwen 2.5', provider: 'pollinations', type: 'text', tags: ['alibaba'] },
  { id: 'gemini', name: 'Gemini 2.0 Flash', provider: 'pollinations', type: 'text', tags: ['google'] },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B', provider: 'huggingface', type: 'text', tags: ['open-source'] },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct', name: 'Llama 3.1 8B', provider: 'huggingface', type: 'text', tags: ['meta'] },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google', type: 'text', tags: ['google', 'fast'] },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', type: 'text', tags: ['google', 'reasoning'] },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', type: 'text', tags: ['google'] },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Groq)', provider: 'groq', type: 'text', tags: ['meta', 'fast'] },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant (Groq)', provider: 'groq', type: 'text', tags: ['meta', 'fast'] },
  { id: 'qwen/qwen3-32b', name: 'Qwen3 32B (Groq)', provider: 'groq', type: 'text', tags: ['alibaba', 'fast'] },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (OpenRouter)', provider: 'openrouter', type: 'text', tags: ['meta', 'free'] },
  { id: 'qwen/qwen3-235b-a22b-thinking-2507:free', name: 'Qwen3 235B Thinking', provider: 'openrouter', type: 'text', tags: ['alibaba', 'reasoning', 'free'] },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', provider: 'openrouter', type: 'text', tags: ['mistral', 'free'] },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: 'openrouter', type: 'text', tags: ['google', 'free'] },
];

export const defaultAudioModels: ModelOption[] = [
  { id: 'openai-audio', name: 'OpenAI TTS', provider: 'pollinations', type: 'audio', tags: ['tts'] },
];

export const defaultVideoModels: ModelOption[] = [
  { id: 'wan', name: 'Wan', provider: 'pollinations', type: 'video', tags: ['pollinations'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
  { id: 'seedance', name: 'Seedance', provider: 'pollinations', type: 'video', tags: ['pollinations'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
  { id: 'seedance-pro', name: 'Seedance Pro', provider: 'pollinations', type: 'video', tags: ['pollinations', 'pro'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
  { id: 'veo', name: 'Veo', provider: 'pollinations', type: 'video', tags: ['pollinations', 'google'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
  { id: 'grok-video', name: 'Grok Video', provider: 'pollinations', type: 'video', tags: ['pollinations', 'xai'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
  { id: 'ltx-2', name: 'LTX-2', provider: 'pollinations', type: 'video', tags: ['pollinations'], capabilities: { supportsVideoOutput: true, supportsImageToVideo: true, supportedVideoParams: { duration: true, aspectRatio: true, audio: true } } },
];
