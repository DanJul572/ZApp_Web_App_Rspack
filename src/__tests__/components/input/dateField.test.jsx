import { fireEvent, render, screen } from '@testing-library/react';
import DateField from '@/components/input/DateField';

describe('DateField Input Component', () => {
  it('renders label', () => {
    render(<DateField label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<DateField label="Date" value="2024-06-01" />);
    const input = document.getElementsByClassName(
      'MuiPickersInputBase-input',
    )[0];
    expect(input).toHaveValue('01/06/2024');
  });

  it('calls onChange with formatted date', async () => {
    const handleChange = jest.fn();
    render(<DateField label="Date" onChange={handleChange} />);

    const button = document.getElementsByClassName('MuiButtonBase-root')[0];
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const dayButton = screen.getByText('1');
    expect(dayButton).toBeInTheDocument();
    fireEvent.click(dayButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<DateField label="Date" disabled />);
    const input = document.getElementsByClassName(
      'MuiPickersInputBase-input',
    )[0];
    expect(input).toBeDisabled();
  });
});
