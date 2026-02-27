import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes for video generation

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-hf-token');

    if (!token) {
      return NextResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('image') as Blob | null;
    const prompt = (formData.get('prompt') as string) || '';
    const model = formData.get('model') as string | null;

    if (!image) {
      return NextResponse.json({ error: 'Image file required' }, { status: 400 });
    }

    const hf = new HfInference(token);
    let result: unknown;

    if (prompt) {
      result = await hf.imageToVideo({
        model: model || 'stabilityai/stable-video-diffusion-img2vid-xt',
        inputs: image,
        parameters: {
          prompt,
        },
      });
    } else {
      result = await hf.imageToVideo({
        model: model || 'stabilityai/stable-video-diffusion-img2vid-xt',
        inputs: image,
      });
    }

    const blob = result as Blob;
    const buffer = await blob.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image-to-video generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
