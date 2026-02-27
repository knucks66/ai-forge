export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  systemPrompt: string;
  model: string;
  provider: import('./generation').Provider;
  createdAt: number;
  updatedAt: number;
  title?: string;
}
