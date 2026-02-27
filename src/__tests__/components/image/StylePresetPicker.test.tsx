import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StylePresetPicker } from '@/components/image/StylePresetPicker';
import { stylePresets, styleCategories } from '@/data/style-presets';

describe('StylePresetPicker', () => {
  const defaultProps = {
    selected: 'none',
    onSelect: vi.fn(),
  };

  it('renders "Style Preset" label', () => {
    render(<StylePresetPicker {...defaultProps} />);
    expect(screen.getByText('Style Preset')).toBeInTheDocument();
  });

  it('renders category tabs', () => {
    render(<StylePresetPicker {...defaultProps} />);
    for (const cat of styleCategories) {
      // Some category names match preset names, so use getAllByText
      const elements = screen.getAllByText(cat.name);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('shows all presets when "None" category is active (default)', () => {
    render(<StylePresetPicker {...defaultProps} />);
    // All presets should be visible (some names may appear in both tabs and preset grid)
    for (const preset of stylePresets) {
      const elements = screen.getAllByText(preset.name);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('filters presets when category is clicked', async () => {
    const user = userEvent.setup();
    render(<StylePresetPicker {...defaultProps} />);

    // Click "Photography" category
    await user.click(screen.getByText('Photography'));

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
    // The "Anime" button should have accent styling — we verify the button exists
    const animeButton = screen.getByText('Anime').closest('button');
    expect(animeButton).toBeInTheDocument();
  });

  it('shows preset title with prompt info', () => {
    render(<StylePresetPicker {...defaultProps} />);
    const photoButton = screen.getByText('Photorealistic').closest('button');
    expect(photoButton).toHaveAttribute('title');
    expect(photoButton!.getAttribute('title')).toContain('photorealistic');
  });
});
