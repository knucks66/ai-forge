import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate, formatFileSize, truncateText } from '@/lib/utils/formatters';

describe('formatDuration', () => {
  it('formats milliseconds', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('formats seconds', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(5000)).toBe('5s');
    expect(formatDuration(59000)).toBe('59s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  it('handles boundary at 1 second', () => {
    expect(formatDuration(999)).toBe('999ms');
    expect(formatDuration(1000)).toBe('1s');
  });
});

describe('formatDate', () => {
  it('formats a timestamp to human-readable date', () => {
    // Use a fixed timestamp: Jan 15, 2025 10:30 AM UTC
    const ts = new Date('2025-01-15T10:30:00Z').getTime();
    const result = formatDate(ts);
    // Should contain month, day, year
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2025/);
  });

  it('handles epoch 0', () => {
    const result = formatDate(0);
    // In some timezones epoch 0 shows as Dec 31, 1969
    expect(result).toMatch(/19(69|70)/);
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048575)).toBe('1024.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
    expect(formatFileSize(10485760)).toBe('10.0 MB');
  });
});

describe('truncateText', () => {
  it('returns full text if under maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    expect(truncateText('hello world', 8)).toBe('hello...');
    expect(truncateText('abcdefghij', 7)).toBe('abcd...');
  });

  it('handles empty string', () => {
    expect(truncateText('', 5)).toBe('');
  });

  it('handles maxLength of 3 (minimum for ellipsis)', () => {
    expect(truncateText('hello', 3)).toBe('...');
  });
});
