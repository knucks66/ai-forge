import { NextRequest, NextResponse } from 'next/server';

const POLLINATIONS_BASE = 'https://gen.pollinations.ai';

/**
 * Upload image to a temporary file host and return the URL.
 * Uses 0x0.st which accepts anonymous uploads and returns a plain-text URL.
 */
async function uploadToTempHost(imageBlob: Blob, filename: string): Promise<string> {
  const form = new FormData();
  form.append('file', imageBlob, filename);

  const res = await fetch('https://0x0.st', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to temporary host');
  }

  const url = (await res.text()).trim();
  if (!url.startsWith('http')) {
    throw new Error('Invalid response from temporary host');
  }
  return url;
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

    // Upload image to get a publicly accessible URL
    const imageUrl = await uploadToTempHost(imageFile, 'input.png');

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

    // Forward auth header if present
    const authHeader = req.headers.get('authorization');
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
