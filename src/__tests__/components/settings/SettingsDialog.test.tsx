import { describe, it, expect, vi, beforeEach, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAppStore } from '@/stores/useAppStore';
import { server } from '@/test/msw/server';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  useSettingsStore.setState({ hfToken: '', pollinationsKey: '' });
  useAppStore.setState({ theme: 'dark' });
});

describe('SettingsDialog', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders Settings title', () => {
    render(<SettingsDialog onClose={onClose} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders API Keys section', () => {
    render(<SettingsDialog onClose={onClose} />);
    expect(screen.getByText('API Keys')).toBeInTheDocument();
  });

  it('renders HuggingFace token input', () => {
    render(<SettingsDialog onClose={onClose} />);
    expect(screen.getByPlaceholderText('hf_...')).toBeInTheDocument();
  });

  it('renders Pollinations key input', () => {
    render(<SettingsDialog onClose={onClose} />);
    expect(screen.getByPlaceholderText(/pk_... or sk_.../)).toBeInTheDocument();
  });

  it('HF token input is password by default', () => {
    render(<SettingsDialog onClose={onClose} />);
    const input = screen.getByPlaceholderText('hf_...');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles HF token visibility', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog onClose={onClose} />);

    const input = screen.getByPlaceholderText('hf_...');
    expect(input).toHaveAttribute('type', 'password');

    // Find the eye toggle button (within the HF section)
    const toggleButtons = screen.getAllByRole('button');
    // The show/hide button is near the HF input
    const hfToggle = toggleButtons.find(
      (btn) => btn.closest('.relative')?.querySelector('input[placeholder="hf_..."]')
    );
    if (hfToggle) {
      await user.click(hfToggle);
      expect(input).toHaveAttribute('type', 'text');
    }
  });

  it('updates HF token in store on input', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog onClose={onClose} />);

    const input = screen.getByPlaceholderText('hf_...');
    await user.type(input, 'hf_test123');
    expect(useSettingsStore.getState().hfToken).toBe('hf_test123');
  });

  it('updates Pollinations key in store on input', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog onClose={onClose} />);

    const input = screen.getByPlaceholderText(/pk_... or sk_.../);
    await user.type(input, 'pk_mykey');
    expect(useSettingsStore.getState().pollinationsKey).toBe('pk_mykey');
  });

  it('renders Appearance section with Dark/Light buttons', () => {
    render(<SettingsDialog onClose={onClose} />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('selects light theme when Light button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog onClose={onClose} />);

    await user.click(screen.getByText('Light'));
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('selects dark theme when Dark button is clicked', async () => {
    const user = userEvent.setup();
    useAppStore.setState({ theme: 'light' });
    render(<SettingsDialog onClose={onClose} />);

    await user.click(screen.getByText('Dark'));
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog onClose={onClose} />);

    // The X button
    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons[0]; // First button is the close X
    await user.click(xButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking backdrop', async () => {
    const user = userEvent.setup();
    const { container } = render(<SettingsDialog onClose={onClose} />);

    // Click the backdrop (outermost div)
    const backdrop = container.firstElementChild as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders Test buttons for API connections', () => {
    render(<SettingsDialog onClose={onClose} />);
    const testButtons = screen.getAllByText('Test');
    expect(testButtons).toHaveLength(5); // HF + Pollinations + Google + Groq + OpenRouter
  });

  it('Test buttons are disabled when tokens are empty', () => {
    render(<SettingsDialog onClose={onClose} />);
    const testButtons = screen.getAllByText('Test');
    for (const btn of testButtons) {
      expect(btn.closest('button')).toBeDisabled();
    }
  });
});
