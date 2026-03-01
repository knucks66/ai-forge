import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes for video generation

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();
    const token = req.headers.get('x-hf-token');

    if (!token) {
      return NextResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }

    const hf = new HfInference(token);
    const result = await hf.textToVideo({
      model: model || 'ali-vilab/text-to-video-ms-1.7b',
      provider: 'hf-inference',
      inputs: prompt,
    });

    // HF SDK types say string but textToVideo actually returns a Blob
    const blob = result as unknown as Blob;
    const buffer = await blob.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Video generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
