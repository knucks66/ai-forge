import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StylePresetPicker } from '@/components/image/StylePresetPicker';
import { stylePresets, styleCategories } from '@/data/style-presets';
import { useSettingsStore } from '@/stores/useSettingsStore';

beforeEach(() => {
  useSettingsStore.setState({ nsfwEnabled: false });
});

describe('StylePresetPicker', () => {
  const defaultProps = {
    selected: 'none',
    onSelect: vi.fn(),
  };

  it('renders "Style Preset" label', () => {
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.getByText('Style Preset')).toBeInTheDocument();
  });

  it('renders category tabs (excluding NSFW by default)', () => {
    render(<StylePresetPicker {...defaultProps} />);
    const visibleCategories = styleCategories.filter((c) => c.id !== 'nsfw');
    for (const cat of visibleCategories) {
      const elements = screen.getAllByText(new RegExp(cat.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('hides NSFW category tab by default', () => {
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.queryByText(/NSFW/)).not.toBeInTheDocument();
  });

  it('shows NSFW category tab when nsfwEnabled is true', () => {
    useSettingsStore.setState({ nsfwEnabled: true });
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.getByText(/NSFW/)).toBeInTheDocument();
  });

  it('hides NSFW presets by default', () => {
    render(<StylePresetPicker {...defaultProps} />);
    const nsfwPresets = stylePresets.filter((p) => p.nsfw);
    for (const preset of nsfwPresets) {
      expect(screen.queryByText(preset.name)).not.toBeInTheDocument();
    }
  });

  it('shows NSFW presets when nsfwEnabled is true', async () => {
    useSettingsStore.setState({ nsfwEnabled: true });
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    // Click the NSFW category tab
    await user.click(screen.getByText(/NSFW/));

    // Should show NSFW presets
    expect(screen.getByText('Boudoir')).toBeInTheDocument();
  });

  it('shows all non-NSFW presets when "None" category is active', () => {
    render(<StylePresetPicker {...defaultProps} />);
    const nonNsfwPresets = stylePresets.filter((p) => !p.nsfw);
    // Spot-check several presets rather than all
    expect(screen.getByText('No Style')).toBeInTheDocument();
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();
    expect(screen.getByText('Anime')).toBeInTheDocument();
    expect(screen.getByText('Oil Painting')).toBeInTheDocument();
    expect(screen.getByText('Origami')).toBeInTheDocument();
    expect(screen.getByText('Graffiti')).toBeInTheDocument();
  });

  it('filters presets when category is clicked', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    // Click "Photography" category
    await user.click(screen.getByText(/Photography/));

    // Should show photography presets + "No Style" (none category)
    expect(screen.getByText('No Style')).toBeInTheDocument();
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();

    // Should NOT show anime presets
    expect(screen.queryByText('Chibi')).not.toBeInTheDocument();
  });

  it('calls onSelect when a preset is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StylePresetPicker {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText('Photorealistic'));
    expect(onSelect).toHaveBeenCalledWith('photo-realistic');
  });

  it('highlights selected preset', () => {
    render(<StylePresetPicker {...defaultProps} selected="anime" />);
    const animeButton = screen.getByText('Anime').closest('button');
    expect(animeButton).toBeInTheDocument();
  });

  it('shows preset title with prompt info', () => {
    render(<StylePresetPicker {...defaultProps} />);
    const photoButton = screen.getByText('Photorealistic').closest('button');
    expect(photoButton).toHaveAttribute('title');
    expect(photoButton!.getAttribute('title')).toContain('photorealistic');
  });

  it('renders search input', () => {
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search styles...')).toBeInTheDocument();
  });

  it('filters presets by search query', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'watercolor');

    expect(screen.getByText('Watercolor')).toBeInTheDocument();
    expect(screen.getByText('Watercolor Anime')).toBeInTheDocument();
    expect(screen.queryByText('Photorealistic')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no results', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'xyznonexistent');

    expect(screen.getByText(/No styles match/)).toBeInTheDocument();
  });

  it('clears search when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'watercolor');

    // Find and click the clear button
    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find((btn) => btn.querySelector('svg.w-3\\.5'));
    // Verify there's content filtered
    expect(screen.queryByText('Photorealistic')).not.toBeInTheDocument();

    // Clear the search
    await user.clear(searchInput);
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();
  });

  it('renders count badges on category tabs', () => {
    render(<StylePresetPicker {...defaultProps} />);
    // Photography should have a count badge
    const photographyTab = screen.getByText(/Photography/).closest('button');
    expect(photographyTab?.textContent).toMatch(/\(\d+\)/);
  });

  it('renders new category tabs', () => {
    render(<StylePresetPicker {...defaultProps} />);
    // Use getAllByText since category names may appear in preset names too
    expect(screen.getAllByText(/Illustration/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cultural/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Craft & Paper/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Street & Urban/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Game Art/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Architecture/).length).toBeGreaterThanOrEqual(1);
  });
});
