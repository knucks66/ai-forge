import { describe, it, expect, beforeEach } from 'vitest';
import { useTextStore } from '@/stores/useTextStore';
import { ChatMessage } from '@/types/chat';

const { getState, setState } = useTextStore;

const makeMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'msg-1',
  role: 'user',
  content: 'Hello',
  timestamp: Date.now(),
  ...overrides,
});

beforeEach(() => {
  setState({
    messages: [],
    systemPrompt: '',
    model: 'openai',
    provider: 'pollinations',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    isGenerating: false,
    error: null,
    showSystemPrompt: false,
  });
});

describe('useTextStore', () => {
  describe('defaults', () => {
    it('has correct initial state', () => {
      const state = getState();
      expect(state.messages).toEqual([]);
      expect(state.systemPrompt).toBe('');
      expect(state.model).toBe('openai');
      expect(state.provider).toBe('pollinations');
      expect(state.temperature).toBe(0.7);
      expect(state.maxTokens).toBe(2048);
      expect(state.topP).toBe(0.9);
    });
  });

  describe('addMessage', () => {
    it('appends a message to the array', () => {
      const msg = makeMessage();
      getState().addMessage(msg);
      expect(getState().messages).toHaveLength(1);
      expect(getState().messages[0]).toEqual(msg);
    });

    it('preserves existing messages', () => {
      const msg1 = makeMessage({ id: '1', content: 'first' });
      const msg2 = makeMessage({ id: '2', content: 'second' });
      getState().addMessage(msg1);
      getState().addMessage(msg2);
      expect(getState().messages).toHaveLength(2);
      expect(getState().messages[0].content).toBe('first');
      expect(getState().messages[1].content).toBe('second');
    });
  });

  describe('updateLastAssistantMessage', () => {
    it('updates the last assistant message content', () => {
      setState({
        messages: [
          makeMessage({ id: '1', role: 'user', content: 'Hi' }),
          makeMessage({ id: '2', role: 'assistant', content: 'Hello' }),
        ],
      });

      getState().updateLastAssistantMessage('Hello, how can I help?');
      expect(getState().messages[1].content).toBe('Hello, how can I help?');
    });

    it('updates the LAST assistant message when multiple exist', () => {
      setState({
        messages: [
          makeMessage({ id: '1', role: 'assistant', content: 'First response' }),
          makeMessage({ id: '2', role: 'user', content: 'Follow up' }),
          makeMessage({ id: '3', role: 'assistant', content: 'Second response' }),
        ],
      });

      getState().updateLastAssistantMessage('Updated second');
      expect(getState().messages[0].content).toBe('First response'); // unchanged
      expect(getState().messages[2].content).toBe('Updated second');
    });

    it('does nothing when no assistant message exists', () => {
      setState({
        messages: [makeMessage({ id: '1', role: 'user', content: 'Hi' })],
      });

      getState().updateLastAssistantMessage('New content');
      expect(getState().messages).toHaveLength(1);
      expect(getState().messages[0].content).toBe('Hi');
    });
  });

  describe('clearMessages', () => {
    it('empties the messages array', () => {
      setState({
        messages: [
          makeMessage({ id: '1' }),
          makeMessage({ id: '2' }),
        ],
      });

      getState().clearMessages();
      expect(getState().messages).toEqual([]);
    });
  });

  describe('setters', () => {
    it('setSystemPrompt', () => {
      getState().setSystemPrompt('You are helpful');
      expect(getState().systemPrompt).toBe('You are helpful');
    });

    it('setModel', () => {
      getState().setModel('mistral');
      expect(getState().model).toBe('mistral');
    });

    it('setProvider', () => {
      getState().setProvider('huggingface');
      expect(getState().provider).toBe('huggingface');
    });

    it('setTemperature', () => {
      getState().setTemperature(1.0);
      expect(getState().temperature).toBe(1.0);
    });

    it('setMaxTokens', () => {
      getState().setMaxTokens(4096);
      expect(getState().maxTokens).toBe(4096);
    });

    it('setTopP', () => {
      getState().setTopP(0.5);
      expect(getState().topP).toBe(0.5);
    });

    it('setIsGenerating', () => {
      getState().setIsGenerating(true);
      expect(getState().isGenerating).toBe(true);
    });

    it('setError', () => {
      getState().setError('API error');
      expect(getState().error).toBe('API error');
    });

    it('setShowSystemPrompt', () => {
      getState().setShowSystemPrompt(true);
      expect(getState().showSystemPrompt).toBe(true);
    });
  });
});
