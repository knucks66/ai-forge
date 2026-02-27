import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptInput } from '@/components/shared/PromptInput';
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

describe('PromptInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  it('renders textarea with placeholder', () => {
    render(<PromptInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/describe what you want to create/i)).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<PromptInput {...defaultProps} placeholder="Type something..." />);
    expect(screen.getByPlaceholderText('Type something...')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PromptInput {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSubmit on Enter (without Shift)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptInput {...defaultProps} value="test" onSubmit={onSubmit} />);

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not call onSubmit on Shift+Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptInput {...defaultProps} value="test" onSubmit={onSubmit} />);

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows enhance button by default', () => {
    render(<PromptInput {...defaultProps} />);
    expect(screen.getByTitle(/enhance prompt/i)).toBeInTheDocument();
  });

  it('hides enhance button when showEnhance is false', () => {
    render(<PromptInput {...defaultProps} showEnhance={false} />);
    expect(screen.queryByTitle(/enhance prompt/i)).not.toBeInTheDocument();
  });

  it('disables textarea when disabled', () => {
    render(<PromptInput {...defaultProps} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('enhance button is disabled when value is empty', () => {
    render(<PromptInput {...defaultProps} value="" />);
    expect(screen.getByTitle(/enhance prompt/i)).toBeDisabled();
  });

  it('enhance button is enabled when value has text', () => {
    render(<PromptInput {...defaultProps} value="a sunset" />);
    expect(screen.getByTitle(/enhance prompt/i)).not.toBeDisabled();
  });
});
