import { fireEvent, render, screen } from '@testing-library/react';
import Radio from '@/components/input/Radio';

describe('Radio Input Component', () => {
  const mockOnChange = jest.fn();
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  it('renders the label', () => {
    render(<Radio label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Radio options={options} />);
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('handles onChange correctly', () => {
    render(<Radio value="option1" options={options} onChange={mockOnChange} />);
    const secondOption = screen.getByLabelText('Option 2');
    fireEvent.click(secondOption);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('disables options when disabled prop is true', () => {
    render(<Radio options={options} disabled />);
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeDisabled();
    });
  });

  it('checks the correct option based on value prop', () => {
    render(<Radio value="option1" options={options} />);
    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
  });
});
