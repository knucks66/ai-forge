import { NextRequest, NextResponse } from 'next/server';

interface InferenceProvider {
  provider: string;
  status: string;
}

interface HfModel {
  modelId?: string;
  id?: string;
  description?: string;
  tags?: string[];
  inferenceProviderMapping?: InferenceProvider[];
}

export async function GET(req: NextRequest) {
  try {
    const task = req.nextUrl.searchParams.get('task') || 'text-to-image';
    const token = req.headers.get('x-hf-token');

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Fetch more models and expand inference provider info so we can filter
    // to only models available on the free hf-inference serverless API
    const response = await fetch(
      `https://huggingface.co/api/models?pipeline_tag=${task}&sort=downloads&direction=-1&limit=100&expand[]=inferenceProviderMapping`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const models: HfModel[] = await response.json();

    // Filter to models that have the free hf-inference provider available
    const withFreeInference = models.filter((m) =>
      m.inferenceProviderMapping?.some(
        (p) => p.provider === 'hf-inference' && p.status === 'live'
      )
    );

    const normalized = withFreeInference.map((m) => ({
      id: m.modelId || m.id,
      name: (m.modelId as string || m.id as string || '').split('/').pop(),
      provider: 'huggingface',
      type: task === 'text-to-image' ? 'image' : task === 'text-generation' ? 'text' : task === 'text-to-video' ? 'video' : 'text',
      description: (m.description || '').slice(0, 100),
      tags: m.tags || [],
    }));

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch models';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
