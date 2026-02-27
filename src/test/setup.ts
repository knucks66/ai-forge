import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup React Testing Library after each test
afterEach(() => {
  cleanup();
});

// Stub URL.createObjectURL / revokeObjectURL (not available in jsdom)
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (typeof URL.revokeObjectURL === 'undefined') {
  URL.revokeObjectURL = vi.fn();
}

// Clear localStorage between tests
afterEach(() => {
  localStorage.clear();
});
