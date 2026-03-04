import { NextRequest, NextResponse } from 'next/server';

const POLLINATIONS_BASE = 'https://gen.pollinations.ai';

/**
 * Upload image to Pollinations' own media hosting service.
 * Returns a publicly accessible URL that the image generation endpoint can use.
 */
async function uploadToPollinationsMedia(imageBlob: Blob, authHeader: string | null): Promise<string> {
  const form = new FormData();
  form.append('file', imageBlob, 'input.png');

  const headers: Record<string, string> = {};
  if (authHeader) headers['Authorization'] = authHeader;

  const res = await fetch('https://media.pollinations.ai/upload', {
    method: 'POST',
    headers,
    body: form,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to Pollinations media service');
  }

  const data = await res.json();
  if (!data.url) {
    throw new Error('No URL returned from media upload');
  }
  return data.url;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as Blob | null;
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string | null;
    const width = formData.get('width') as string | null;
    const height = formData.get('height') as string | null;
    const seed = formData.get('seed') as string | null;
    const negativePrompt = formData.get('negative_prompt') as string | null;

    if (!imageFile || !prompt) {
      return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
    }

    // Forward auth header if present
    const authHeader = req.headers.get('authorization');

    // Upload image to Pollinations media service to get a publicly accessible URL
    const imageUrl = await uploadToPollinationsMedia(imageFile, authHeader);

    // Build Pollinations request
    const params = new URLSearchParams();
    if (model) params.set('model', model);
    if (width) params.set('width', width);
    if (height) params.set('height', height);
    if (seed) params.set('seed', seed);
    if (negativePrompt) params.set('negative_prompt', negativePrompt);
    params.set('image', imageUrl);
    params.set('nologo', 'true');

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `${POLLINATIONS_BASE}/image/${encodedPrompt}?${params.toString()}`;

    const headers: Record<string, string> = {};
    if (authHeader) headers['Authorization'] = authHeader;

    const response = await fetch(pollinationsUrl, { headers });
    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const msg = errBody?.error?.message || response.statusText;
      return NextResponse.json(
        { error: `Pollinations image generation failed: ${msg}` },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { 'Content-Type': blob.type || 'image/png' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image-to-image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
