import { fireEvent, render, screen } from '@testing-library/react';
import Datetime from '@/components/input/Datetime';

describe('Datetime Input Component', () => {
  it('renders label', () => {
    render(<Datetime label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<Datetime label="Date" value="2024-06-01 08:00:00" />);
    const input = document.getElementsByClassName(
      'MuiPickersInputBase-input',
    )[0];
    expect(input).toHaveValue('01 Jun 2024 08:00:00');
  });

  it('calls onChange with formatted date', async () => {
    const handleChange = jest.fn();
    render(<Datetime label="Date" onChange={handleChange} />);

    const button = document.getElementsByClassName('MuiButtonBase-root')[0];
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const dayButton = screen.getByText('1');
    expect(dayButton).toBeInTheDocument();
    fireEvent.click(dayButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<Datetime label="Date" disabled />);
    const input = document.getElementsByClassName(
      'MuiPickersInputBase-input',
    )[0];
    expect(input).toBeDisabled();
  });
});
