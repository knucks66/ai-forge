/**
 * Convert a Blob to a data URI string.
 */
export function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob as data URI'));
    reader.readAsDataURL(blob);
  });
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

/**
 * Validate an image file for type and size constraints.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Accepted: JPEG, PNG, GIF, WebP, BMP.` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum: 10MB.` };
  }
  return { valid: true };
}
