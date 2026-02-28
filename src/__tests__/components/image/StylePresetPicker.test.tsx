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

  async function openDropdown() {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /No Style/i });
    await user.click(trigger);
    return user;
  }

  it('renders "Style Preset" label', () => {
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.getByText('Style Preset')).toBeInTheDocument();
  });

  it('shows selected preset name and color dot in trigger', () => {
    render(<StylePresetPicker {...defaultProps} selected="anime" />);
    expect(screen.getByText('Anime')).toBeInTheDocument();
  });

  it('shows "No Style" in trigger when no style selected', () => {
    render(<StylePresetPicker {...defaultProps} selected="none" />);
    expect(screen.getByText('No Style')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    await openDropdown();
    expect(screen.getByPlaceholderText('Search styles...')).toBeInTheDocument();
  });

  it('renders search input inside dropdown', async () => {
    await openDropdown();
    const searchInput = screen.getByPlaceholderText('Search styles...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category group headers', async () => {
    await openDropdown();
    const visibleCategories = styleCategories.filter((c) => c.id !== 'nsfw' && c.id !== 'none');
    for (const cat of visibleCategories) {
      const elements = screen.getAllByText(new RegExp(cat.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders preset items with names', async () => {
    await openDropdown();
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();
    expect(screen.getByText('Oil Painting')).toBeInTheDocument();
    expect(screen.getByText('Origami')).toBeInTheDocument();
  });

  it('calls onSelect when a preset is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StylePresetPicker selected="none" onSelect={onSelect} />);

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /No Style/i }));
    // Click a preset
    await user.click(screen.getByText('Photorealistic'));
    expect(onSelect).toHaveBeenCalledWith('photo-realistic');
  });

  it('closes dropdown after selecting a preset', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StylePresetPicker selected="none" onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /No Style/i }));
    expect(screen.getByPlaceholderText('Search styles...')).toBeInTheDocument();

    await user.click(screen.getByText('Photorealistic'));
    expect(screen.queryByPlaceholderText('Search styles...')).not.toBeInTheDocument();
  });

  it('filters presets by search query', async () => {
    const user = await openDropdown();

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'watercolor');

    expect(screen.getByText('Watercolor')).toBeInTheDocument();
    expect(screen.getByText('Watercolor Anime')).toBeInTheDocument();
    expect(screen.queryByText('Photorealistic')).not.toBeInTheDocument();
  });

  it('hides category headers when searching', async () => {
    const user = await openDropdown();

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'watercolor');

    // Category headers should not be visible during search
    expect(screen.queryByText('PHOTOGRAPHY')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no results', async () => {
    const user = await openDropdown();

    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'xyznonexistent');

    expect(screen.getByText(/No styles match/)).toBeInTheDocument();
  });

  it('"No Style" option is always visible at top of dropdown', async () => {
    await openDropdown();
    // "No Style" should appear in the dropdown list (separate from trigger)
    const noStyleButtons = screen.getAllByText('No Style');
    // One in trigger, one in dropdown list
    expect(noStyleButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelect with "none" when "No Style" is clicked in dropdown', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StylePresetPicker selected="anime" onSelect={onSelect} />);

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /Anime/i }));
    // Click "No Style" in the dropdown
    const noStyleButtons = screen.getAllByText('No Style');
    // The one inside the dropdown (not the trigger)
    await user.click(noStyleButtons[noStyleButtons.length - 1]);
    expect(onSelect).toHaveBeenCalledWith('none');
  });

  it('hides NSFW presets by default', async () => {
    await openDropdown();
    const nsfwPresets = stylePresets.filter((p) => p.nsfw);
    for (const preset of nsfwPresets) {
      expect(screen.queryByText(preset.name)).not.toBeInTheDocument();
    }
  });

  it('hides NSFW category header by default', async () => {
    await openDropdown();
    expect(screen.queryByText(/NSFW/)).not.toBeInTheDocument();
  });

  it('shows NSFW category header when nsfwEnabled is true', async () => {
    useSettingsStore.setState({ nsfwEnabled: true });
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /No Style/i }));

    expect(screen.getByText(/NSFW/)).toBeInTheDocument();
  });

  it('shows NSFW presets when nsfwEnabled is true', async () => {
    useSettingsStore.setState({ nsfwEnabled: true });
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /No Style/i }));

    expect(screen.getByText('Boudoir')).toBeInTheDocument();
  });

  it('shows CFG badge for presets with suggestedCfg', async () => {
    await openDropdown();
    // Multiple presets have suggestedCfg: 7
    const cfgBadges = screen.getAllByText('CFG 7');
    expect(cfgBadges.length).toBeGreaterThan(0);
  });

  it('clears search when dropdown closes and reopens', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    // Open
    await user.click(screen.getByRole('button', { name: /No Style/i }));
    const searchInput = screen.getByPlaceholderText('Search styles...');
    await user.type(searchInput, 'watercolor');
    expect(screen.queryByText('Photorealistic')).not.toBeInTheDocument();

    // Close by clicking trigger again
    await user.click(screen.getByRole('button', { name: /No Style/i }));

    // Reopen — search should be cleared
    await user.click(screen.getByRole('button', { name: /No Style/i }));
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();
  });

  it('renders count badges on category headers', async () => {
    await openDropdown();
    // Photography has 20 presets
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
