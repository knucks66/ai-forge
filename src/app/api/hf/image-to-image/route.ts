import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-hf-token');

    if (!token) {
      return NextResponse.json({ error: 'HuggingFace token required' }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('image') as Blob | null;
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string | null;
    const negativePrompt = formData.get('negativePrompt') as string | null;
    const strength = parseFloat(formData.get('strength') as string) || 0.75;
    const guidanceScale = parseFloat(formData.get('guidanceScale') as string) || 7;
    const numInferenceSteps = parseInt(formData.get('numInferenceSteps') as string) || 30;

    if (!image) {
      return NextResponse.json({ error: 'Image file required' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const hf = new HfInference(token);
    const result = await hf.imageToImage({
      model: model || 'black-forest-labs/FLUX.2-dev',
      inputs: image,
      parameters: {
        prompt,
        negative_prompt: negativePrompt || undefined,
        strength,
        guidance_scale: guidanceScale,
        num_inference_steps: numInferenceSteps,
      },
    });

    const blob = result as unknown as Blob;
    const buffer = await blob.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image-to-image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
