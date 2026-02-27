import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/stores/useAppStore';

// Mock SettingsDialog to avoid its complexity
vi.mock('@/components/settings/SettingsDialog', () => ({
  SettingsDialog: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="settings-dialog">
      <button onClick={onClose}>Close Settings</button>
    </div>
  ),
}));

beforeEach(() => {
  useAppStore.setState({
    activeMode: 'image',
    sidebarOpen: true,
    theme: 'dark',
  });
});

describe('Header', () => {
  it('displays mode label for image mode', () => {
    render(<Header />);
    expect(screen.getByText('Image Generation')).toBeInTheDocument();
  });

  it('displays mode label for text mode', () => {
    useAppStore.setState({ activeMode: 'text' });
    render(<Header />);
    expect(screen.getByText('Text Chat')).toBeInTheDocument();
  });

  it('displays mode label for audio mode', () => {
    useAppStore.setState({ activeMode: 'audio' });
    render(<Header />);
    expect(screen.getByText('Audio Generation')).toBeInTheDocument();
  });

  it('displays mode label for gallery mode', () => {
    useAppStore.setState({ activeMode: 'gallery' });
    render(<Header />);
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('has theme toggle button', () => {
    render(<Header />);
    expect(screen.getByTitle(/switch to light mode/i)).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByTitle(/switch to light mode/i));
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('shows sun icon in dark mode (switch to light)', () => {
    render(<Header />);
    expect(screen.getByTitle(/switch to light mode/i)).toBeInTheDocument();
  });

  it('shows moon icon in light mode (switch to dark)', () => {
    useAppStore.setState({ theme: 'light' });
    render(<Header />);
    expect(screen.getByTitle(/switch to dark mode/i)).toBeInTheDocument();
  });

  it('has settings button', () => {
    render(<Header />);
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });

  it('opens settings dialog on click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    expect(screen.queryByTestId('settings-dialog')).not.toBeInTheDocument();
    await user.click(screen.getByTitle('Settings'));
    expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
  });

  it('closes settings dialog', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByTitle('Settings'));
    expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();

    await user.click(screen.getByText('Close Settings'));
    expect(screen.queryByTestId('settings-dialog')).not.toBeInTheDocument();
  });
});
