import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { useModelsStore } from '@/stores/useModelsStore';

// Mock the useModels hook
vi.mock('@/lib/hooks/useModels', () => ({
  useModels: () => ({
    refresh: vi.fn(),
    isLoading: false,
  }),
}));

beforeEach(() => {
  useModelsStore.setState({
    imageModels: [
      { id: 'flux', name: 'FLUX.1', provider: 'pollinations', type: 'image' },
      { id: 'turbo', name: 'Turbo', provider: 'pollinations', type: 'image' },
      { id: 'stabilityai/sdxl', name: 'SDXL', provider: 'huggingface', type: 'image' },
    ],
    textModels: [
      { id: 'openai', name: 'GPT-4o Mini', provider: 'pollinations', type: 'text' },
    ],
    audioModels: [],
    videoModels: [],
    lastFetched: {},
    isLoading: false,
  });
});

describe('ModelSelector', () => {
  const defaultProps = {
    type: 'image' as const,
    selectedModel: 'flux',
    selectedProvider: 'pollinations' as const,
    onSelect: vi.fn(),
  };

  it('renders model label', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText('Model')).toBeInTheDocument();
  });

  it('renders a select element', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders Pollinations optgroup with models', () => {
    const { container } = render(<ModelSelector {...defaultProps} />);
    const optgroups = container.querySelectorAll('optgroup');
    expect(optgroups.length).toBeGreaterThanOrEqual(1);
    const pollGroup = Array.from(optgroups).find((g) => g.label?.includes('Pollinations'));
    expect(pollGroup).toBeDefined();
  });

  it('renders HuggingFace optgroup with models', () => {
    const { container } = render(<ModelSelector {...defaultProps} />);
    const optgroups = container.querySelectorAll('optgroup');
    const hfGroup = Array.from(optgroups).find((g) => g.label?.includes('HuggingFace'));
    expect(hfGroup).toBeDefined();
  });

  it('calls onSelect with model and provider when changed', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ModelSelector {...defaultProps} onSelect={onSelect} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'pollinations:turbo');
    expect(onSelect).toHaveBeenCalledWith('turbo', 'pollinations');
  });

  it('handles colon-containing model IDs correctly', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ModelSelector {...defaultProps} onSelect={onSelect} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'huggingface:stabilityai/sdxl');
    expect(onSelect).toHaveBeenCalledWith('stabilityai/sdxl', 'huggingface');
  });

  it('shows model count', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText(/3 models available/)).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByTitle(/refresh model list/i)).toBeInTheDocument();
  });

  it('uses text models when type is text', () => {
    render(
      <ModelSelector
        type="text"
        selectedModel="openai"
        selectedProvider="pollinations"
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText(/1 models available/)).toBeInTheDocument();
  });
});
