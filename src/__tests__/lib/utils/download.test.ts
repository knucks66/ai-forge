import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadBlob, downloadUrl } from '@/lib/utils/download';

describe('downloadBlob', () => {
  let clickSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
      style: {},
    } as unknown as HTMLAnchorElement);
    createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = createObjectURLSpy as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURLSpy as typeof URL.revokeObjectURL;
  });

  it('creates an object URL, clicks the anchor, and cleans up', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    downloadBlob(blob, 'test.txt');

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets the download filename', () => {
    const anchor = { href: '', download: '', click: vi.fn(), style: {} };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement);

    downloadBlob(new Blob(['data']), 'image.png');
    expect(anchor.download).toBe('image.png');
  });
});

describe('downloadUrl', () => {
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  it('creates an anchor with href, download, and target="_blank"', () => {
    const anchor = { href: '', download: '', target: '', click: clickSpy, style: {} };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement);

    downloadUrl('https://example.com/file.png', 'file.png');

    expect(anchor.href).toBe('https://example.com/file.png');
    expect(anchor.download).toBe('file.png');
    expect(anchor.target).toBe('_blank');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
