import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Slider from '@/components/input/Slider';

// Mock the aliased MuiSlider
jest.mock('@/aliases/MuiSlider', () => {
  return jest.fn((props) => {
    const { onChange, value, disabled, color } = props;

    return (
      <input
        type="range"
        data-testid="mui-slider"
        value={value}
        disabled={disabled}
        data-color={color}
        onChange={onChange}
      />
    );
  });
});

describe('Slider Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label text', () => {
    render(<Slider label="Volume" value={10} />);

    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders slider with default value when value is not provided', () => {
    render(<Slider label="Volume" />);

    const slider = screen.getByTestId('mui-slider');
    expect(slider).toHaveValue('0');
  });

  it('renders slider with provided value', () => {
    render(<Slider label="Volume" value={30} />);

    const slider = screen.getByTestId('mui-slider');
    expect(slider).toHaveValue('30');
  });

  it('calls onChange with slider value', () => {
    const handleChange = jest.fn();

    render(<Slider label="Volume" value={20} onChange={handleChange} />);

    const slider = screen.getByTestId('mui-slider');
    fireEvent.change(slider, { target: { value: '50' } });

    expect(handleChange).toHaveBeenCalledWith('50');
  });

  it('disables slider when disabled prop is true', () => {
    render(<Slider label="Volume" value={10} disabled />);

    const slider = screen.getByTestId('mui-slider');
    expect(slider).toBeDisabled();
  });

  it('uses provided color prop', () => {
    render(<Slider label="Volume" value={10} color="secondary" />);

    const slider = screen.getByTestId('mui-slider');
    expect(slider).toHaveAttribute('data-color', 'secondary');
  });

  it('defaults color prop to primary', () => {
    render(<Slider label="Volume" value={10} />);

    const slider = screen.getByTestId('mui-slider');
    expect(slider).toHaveAttribute('data-color', 'primary');
  });
});
