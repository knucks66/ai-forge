import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateButton } from '@/components/shared/GenerateButton';

describe('GenerateButton', () => {
  it('renders idle state with default label', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={false} />);
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={false} label="Create Image" />);
    expect(screen.getByRole('button', { name: /create image/i })).toBeInTheDocument();
  });

  it('shows loading label when generating', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={true} />);
    expect(screen.getByRole('button', { name: /generating/i })).toBeInTheDocument();
  });

  it('shows custom loading label', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={true} loadingLabel="Creating..." />);
    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
  });

  it('is disabled when generating', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<GenerateButton onClick={vi.fn()} isGenerating={false} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GenerateButton onClick={onClick} isGenerating={false} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GenerateButton onClick={onClick} isGenerating={false} disabled={true} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when generating', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GenerateButton onClick={onClick} isGenerating={true} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
