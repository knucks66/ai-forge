import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const task = req.nextUrl.searchParams.get('task') || 'text-to-image';
    const token = req.headers.get('x-hf-token');

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `https://huggingface.co/api/models?pipeline_tag=${task}&sort=downloads&direction=-1&limit=20`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const models = await response.json();
    const normalized = models.map((m: Record<string, unknown>) => ({
      id: m.modelId || m.id,
      name: (m.modelId as string || m.id as string || '').split('/').pop(),
      provider: 'huggingface',
      type: task === 'text-to-image' ? 'image' : task === 'text-generation' ? 'text' : task === 'text-to-video' ? 'video' : 'text',
      description: (m.description as string || '').slice(0, 100),
      tags: m.tags || [],
    }));

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch models';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
