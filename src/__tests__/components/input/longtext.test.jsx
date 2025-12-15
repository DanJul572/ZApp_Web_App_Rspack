import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LongText from '@/components/input/LongText';

describe('LongText Input Component', () => {
  it('renders label and text field with provided value', () => {
    render(
      <LongText
        label="Description"
        value="Initial text"
        rows={4}
        onChange={jest.fn()}
        disabled={false}
      />,
    );

    // Label is rendered
    expect(screen.getByText('Description')).toBeInTheDocument();

    // TextField displays the value
    expect(screen.getByDisplayValue('Initial text')).toBeInTheDocument();
  });

  it('calls onChange with the correct value when text changes', () => {
    const handleChange = jest.fn();

    render(
      <LongText
        label="Notes"
        value=""
        rows={3}
        onChange={handleChange}
        disabled={false}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'New value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('New value');
  });

  it('renders empty string when value is undefined', () => {
    render(
      <LongText
        label="Comments"
        rows={2}
        onChange={jest.fn()}
        disabled={false}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('disables the text field when disabled is true', () => {
    render(
      <LongText
        label="Disabled field"
        value="Cannot edit"
        rows={2}
        onChange={jest.fn()}
        disabled={true}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
