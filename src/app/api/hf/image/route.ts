import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model, negativePrompt, width, height, guidanceScale, numInferenceSteps } = await req.json();
    const token = req.headers.get('x-hf-token');

    if (!token) {
      return NextResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }

    const hf = new HfInference(token);
    const result = await hf.textToImage({
      model: model || 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt || undefined,
        width: width || 512,
        height: height || 512,
        guidance_scale: guidanceScale || 7,
        num_inference_steps: numInferenceSteps || 30,
      },
    });

    // HF SDK types say string but textToImage actually returns a Blob
    const blob = result as unknown as Blob;
    const buffer = await blob.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
