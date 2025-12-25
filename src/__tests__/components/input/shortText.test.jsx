import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortText from '@/components/input/ShortText';
import { validator } from '@/helpers/validator';

// Mock the validator helper
jest.mock('@/helpers/validator', () => ({
  validator: jest.fn(),
}));

describe('ShortText Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label and input field', () => {
    validator.mockReturnValue({ status: false, message: '' });

    render(<ShortText label="Name" value="" rules={[]} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders tooltip icon when tooltip prop is provided', async () => {
    validator.mockReturnValue({ status: false, message: '' });

    render(<ShortText label="Name" value="" tooltip="Helpful info" />);

    // MUI Tooltip renders on hover
    const helpIcon = screen.getByTestId('HelpIcon');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);

    expect(await screen.findByText('Helpful info')).toBeInTheDocument();
  });

  it('calls onChange with input value', () => {
    validator.mockReturnValue({ status: false, message: '' });
    const handleChange = jest.fn();

    render(<ShortText label="Name" value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'John' } });

    expect(handleChange).toHaveBeenCalledWith('John');
  });

  it('calls onBlur with input value', () => {
    validator.mockReturnValue({ status: false, message: '' });
    const handleBlur = jest.fn();

    render(<ShortText label="Name" value="" onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input, { target: { value: 'Doe' } });

    expect(handleBlur).toHaveBeenCalledWith('Doe');
  });

  it('displays validation error when validator returns error', () => {
    validator.mockReturnValue({
      status: true,
      message: 'Field is required',
    });

    render(<ShortText label="Name" value="" rules={['required']} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    validator.mockReturnValue({ status: false, message: '' });

    render(<ShortText label="Name" value="" disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('passes placeholder to TextField', () => {
    validator.mockReturnValue({ status: false, message: '' });

    render(<ShortText label="Name" value="" placeholder="Enter name" />);

    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });
});
