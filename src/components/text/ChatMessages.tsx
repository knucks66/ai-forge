'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils/cn';
import { Copy, User, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isGenerating: boolean;
}

export function ChatMessages({ messages, isGenerating }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted">
        <div className="text-center space-y-2">
          <Bot className="w-12 h-12 mx-auto opacity-50" />
          <p className="text-sm">Start a conversation</p>
          <p className="text-xs">Choose a model and type a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            'flex gap-3 animate-fade-in',
            msg.role === 'user' && 'flex-row-reverse'
          )}
        >
          {/* Avatar */}
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            msg.role === 'user' ? 'bg-accent/15 text-accent' : 'bg-surface-hover text-muted'
          )}>
            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>

          {/* Message content */}
          <div className={cn(
            'max-w-[80%] rounded-xl px-4 py-3 text-sm',
            msg.role === 'user'
              ? 'bg-accent/15 text-foreground'
              : 'bg-surface border border-border'
          )}>
            {msg.role === 'assistant' && msg.content ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background prose-pre:border prose-pre:border-border prose-code:text-accent">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : msg.role === 'assistant' && !msg.content ? (
              <div className="flex items-center gap-2 text-muted">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">Thinking...</span>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            )}

            {/* Copy button for assistant messages */}
            {msg.role === 'assistant' && msg.content && (
              <button
                onClick={() => copyToClipboard(msg.content)}
                className="mt-2 p-1 rounded text-muted hover:text-foreground transition-colors"
                title="Copy message"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
