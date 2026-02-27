import { describe, it, expect } from 'vitest';
import { blobToDataUri, validateImageFile } from '@/lib/utils/image';

describe('blobToDataUri', () => {
  it('converts a blob to a data URI', async () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const dataUri = await blobToDataUri(blob);
    expect(dataUri).toMatch(/^data:text\/plain;base64,/);
  });

  it('converts an image blob correctly', async () => {
    const blob = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
    const dataUri = await blobToDataUri(blob);
    expect(dataUri).toMatch(/^data:image\/png;base64,/);
  });
});

describe('validateImageFile', () => {
  it('accepts valid JPEG files', () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('accepts valid PNG files', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('accepts valid WebP files', () => {
    const file = new File(['data'], 'test.webp', { type: 'image/webp' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('accepts valid GIF files', () => {
    const file = new File(['data'], 'test.gif', { type: 'image/gif' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('rejects non-image files', () => {
    const file = new File(['data'], 'test.txt', { type: 'text/plain' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('rejects files over 10MB', () => {
    // Create a file that claims to be > 10MB
    const largeData = new Uint8Array(11 * 1024 * 1024);
    const file = new File([largeData], 'large.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File too large');
  });

  it('accepts files at exactly 10MB', () => {
    const data = new Uint8Array(10 * 1024 * 1024);
    const file = new File([data], 'ok.png', { type: 'image/png' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });
});
