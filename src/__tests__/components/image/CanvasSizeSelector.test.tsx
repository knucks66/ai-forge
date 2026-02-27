import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasSizeSelector } from '@/components/image/CanvasSizeSelector';
import { canvasSizes } from '@/data/canvas-sizes';

describe('CanvasSizeSelector', () => {
  const defaultProps = {
    selected: 'square',
    onSelect: vi.fn(),
    customWidth: 512,
    customHeight: 512,
    onCustomWidthChange: vi.fn(),
    onCustomHeightChange: vi.fn(),
  };

  it('renders "Canvas Size" label', () => {
    render(<CanvasSizeSelector {...defaultProps} />);
    expect(screen.getByText('Canvas Size')).toBeInTheDocument();
  });

  it('renders all size options', () => {
    render(<CanvasSizeSelector {...defaultProps} />);
    for (const size of canvasSizes) {
      expect(screen.getByText(size.name)).toBeInTheDocument();
    }
  });

  it('shows dimensions for non-custom sizes', () => {
    render(<CanvasSizeSelector {...defaultProps} />);
    expect(screen.getByText('512x512')).toBeInTheDocument();
    expect(screen.getByText('1024x1024')).toBeInTheDocument();
  });

  it('calls onSelect when a size is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CanvasSizeSelector {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText('Landscape'));
    expect(onSelect).toHaveBeenCalledWith('landscape');
  });

  it('does NOT show custom inputs when custom is not selected', () => {
    render(<CanvasSizeSelector {...defaultProps} selected="square" />);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('shows custom width/height inputs when custom is selected', () => {
    render(<CanvasSizeSelector {...defaultProps} selected="custom" />);
    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons).toHaveLength(2);
    expect(screen.getByText('Width')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
  });

  it('calls onCustomWidthChange when width input changes', () => {
    const onCustomWidthChange = vi.fn();
    render(
      <CanvasSizeSelector
        {...defaultProps}
        selected="custom"
        onCustomWidthChange={onCustomWidthChange}
      />
    );

    const widthInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(widthInput, { target: { value: '768' } });
    expect(onCustomWidthChange).toHaveBeenCalledWith(768);
  });

  it('clamps width to min 128', () => {
    const onCustomWidthChange = vi.fn();
    render(
      <CanvasSizeSelector
        {...defaultProps}
        selected="custom"
        onCustomWidthChange={onCustomWidthChange}
      />
    );

    const widthInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(widthInput, { target: { value: '64' } });
    expect(onCustomWidthChange).toHaveBeenCalledWith(128);
  });

  it('clamps width to max 2048', () => {
    const onCustomWidthChange = vi.fn();
    render(
      <CanvasSizeSelector
        {...defaultProps}
        selected="custom"
        onCustomWidthChange={onCustomWidthChange}
      />
    );

    const widthInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(widthInput, { target: { value: '5000' } });
    expect(onCustomWidthChange).toHaveBeenCalledWith(2048);
  });
});
