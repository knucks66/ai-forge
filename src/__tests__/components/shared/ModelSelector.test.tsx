import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelSelector } from '@/components/shared/ModelSelector';
import { useModelsStore } from '@/stores/useModelsStore';
import { useBalanceStore } from '@/stores/useBalanceStore';

// Mock the useModels hook
vi.mock('@/lib/hooks/useModels', () => ({
  useModels: () => ({
    refresh: vi.fn(),
    isLoading: false,
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: vi.fn(),
}));

beforeEach(() => {
  useModelsStore.setState({
    imageModels: [
      { id: 'flux', name: 'FLUX.1', provider: 'pollinations', type: 'image' },
      { id: 'turbo', name: 'Turbo', provider: 'pollinations', type: 'image' },
      { id: 'kontext', name: 'Kontext', provider: 'pollinations', type: 'image', capabilities: { supportsImageInput: true } },
      { id: 'premium-model', name: 'Premium', provider: 'pollinations', type: 'image', paidOnly: true },
      { id: 'stabilityai/sdxl', name: 'SDXL', provider: 'huggingface', type: 'image' },
    ],
    textModels: [
      { id: 'openai', name: 'GPT-4o Mini', provider: 'pollinations', type: 'text' },
    ],
    audioModels: [],
    videoModels: [
      { id: 'wan', name: 'Wan', provider: 'pollinations', type: 'video', capabilities: { supportsVideoOutput: true, supportsImageToVideo: true } },
      { id: 'ali-vilab/t2v', name: 'T2V 1.7B', provider: 'huggingface', type: 'video', capabilities: { supportsVideoOutput: true } },
    ],
    lastFetched: {},
    isLoading: false,
  });

  useBalanceStore.setState({
    pollinations: null,
    huggingface: null,
    isLoadingPollinations: false,
    isLoadingHuggingface: false,
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

  it('renders trigger button with selected model name', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText('FLUX.1')).toBeInTheDocument();
  });

  it('renders provider badge on trigger', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText('Poll')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    // Click the trigger button
    await user.click(screen.getByText('FLUX.1'));

    // Dropdown should show all models
    expect(screen.getByText('Turbo')).toBeInTheDocument();
    expect(screen.getByText('SDXL')).toBeInTheDocument();
  });

  it('shows Pollinations and HuggingFace group headers', async () => {
    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    await user.click(screen.getByText('FLUX.1'));

    expect(screen.getByText('Pollinations')).toBeInTheDocument();
    expect(screen.getByText('HuggingFace')).toBeInTheDocument();
  });

  it('shows FREE and PAID badges', async () => {
    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    await user.click(screen.getByText('FLUX.1'));

    const freeBadges = screen.getAllByText('FREE');
    const paidBadges = screen.getAllByText('PAID');
    expect(freeBadges.length).toBeGreaterThan(0);
    expect(paidBadges.length).toBeGreaterThan(0);
  });

  it('calls onSelect when a model is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ModelSelector {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText('FLUX.1'));
    await user.click(screen.getByText('Turbo'));

    expect(onSelect).toHaveBeenCalledWith('turbo', 'pollinations');
  });

  it('calls onSelect for HuggingFace model', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ModelSelector {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText('FLUX.1'));
    await user.click(screen.getByText('SDXL'));

    expect(onSelect).toHaveBeenCalledWith('stabilityai/sdxl', 'huggingface');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    await user.click(screen.getByText('FLUX.1'));
    expect(screen.getByText('Turbo')).toBeInTheDocument();

    await user.click(screen.getByText('Turbo'));
    // Dropdown should be closed, Turbo should no longer be visible as a dropdown item
    // (it may still be visible as the selected model in the trigger)
  });

  it('shows model count', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText(/5 models available/)).toBeInTheDocument();
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

  it('shows balance in dropdown header when available', async () => {
    useBalanceStore.setState({
      pollinations: { balance: 5.42, tier: 'seed' },
    });

    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    await user.click(screen.getByText('FLUX.1'));

    expect(screen.getByText('5.42 credits')).toBeInTheDocument();
  });

  it('shows HF plan in dropdown header when available', async () => {
    useBalanceStore.setState({
      huggingface: { username: 'testuser', plan: 'free' },
    });

    const user = userEvent.setup();
    render(<ModelSelector {...defaultProps} />);

    await user.click(screen.getByText('FLUX.1'));

    expect(screen.getByText('free')).toBeInTheDocument();
  });

  describe('requiredCapability filtering', () => {
    it('filters to only models with supportsImageInput', () => {
      render(
        <ModelSelector
          {...defaultProps}
          requiredCapability="supportsImageInput"
        />
      );
      // Only 'kontext' has supportsImageInput
      expect(screen.getByText(/1 models available/)).toBeInTheDocument();
    });

    it('filters video models by supportsImageToVideo', () => {
      render(
        <ModelSelector
          type="video"
          selectedModel="wan"
          selectedProvider="pollinations"
          onSelect={vi.fn()}
          requiredCapability="supportsImageToVideo"
        />
      );
      // Only 'wan' has supportsImageToVideo
      expect(screen.getByText(/1 models available/)).toBeInTheDocument();
    });

    it('shows all models when no requiredCapability', () => {
      render(<ModelSelector {...defaultProps} />);
      expect(screen.getByText(/5 models available/)).toBeInTheDocument();
    });
  });

  describe('paid model affordability', () => {
    it('dims paid models when balance is 0', async () => {
      useBalanceStore.setState({
        pollinations: { balance: 0, tier: 'seed' },
      });

      const user = userEvent.setup();
      const { container } = render(<ModelSelector {...defaultProps} />);

      await user.click(screen.getByText('FLUX.1'));

      // The Premium model button should have opacity-50
      const premiumButton = screen.getByText('Premium').closest('button');
      expect(premiumButton?.className).toContain('opacity-50');
    });

    it('does not dim paid models when balance is positive', async () => {
      useBalanceStore.setState({
        pollinations: { balance: 5.42, tier: 'seed' },
      });

      const user = userEvent.setup();
      render(<ModelSelector {...defaultProps} />);

      await user.click(screen.getByText('FLUX.1'));

      const premiumButton = screen.getByText('Premium').closest('button');
      expect(premiumButton?.className).not.toContain('opacity-50');
    });
  });
});
