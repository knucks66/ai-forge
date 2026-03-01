export async function generateGroqText(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<Response> {
  const response = await fetch('/api/groq/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-groq-api-key': apiKey,
    },
    body: JSON.stringify({
      messages,
      model: options.model || 'llama-3.3-70b-versatile',
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 2048,
      topP: options.topP || 0.9,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Text generation failed' }));
    throw new Error(error.error || 'Text generation failed');
  }

  return response;
}
