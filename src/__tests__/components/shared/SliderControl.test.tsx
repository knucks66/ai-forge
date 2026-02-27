import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SliderControl } from '@/components/shared/SliderControl';

describe('SliderControl', () => {
  const defaultProps = {
    label: 'CFG Scale',
    value: 7,
    onChange: vi.fn(),
    min: 1,
    max: 20,
  };

  it('renders label', () => {
    render(<SliderControl {...defaultProps} />);
    expect(screen.getByText('CFG Scale')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<SliderControl {...defaultProps} value={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders range input with correct attributes', () => {
    render(<SliderControl {...defaultProps} min={1} max={20} step={0.5} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '1');
    expect(slider).toHaveAttribute('max', '20');
    expect(slider).toHaveAttribute('step', '0.5');
  });

  it('calls onChange with number value on input change', () => {
    const onChange = vi.fn();
    render(<SliderControl {...defaultProps} onChange={onChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '15' } });
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('is disabled when disabled prop is true', () => {
    render(<SliderControl {...defaultProps} disabled={true} />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('uses step default of 1', () => {
    render(<SliderControl {...defaultProps} />);
    expect(screen.getByRole('slider')).toHaveAttribute('step', '1');
  });
});
