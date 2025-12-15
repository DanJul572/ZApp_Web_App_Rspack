import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberField from '@/components/input/NumberField';

describe('NumberField Input Component', () => {
  it('renders label and input with provided value', () => {
    render(
      <NumberField
        label="Age"
        value="25"
        rows={1}
        onChange={jest.fn()}
        disabled={false}
      />,
    );

    // Label is rendered
    expect(screen.getByText('Age')).toBeInTheDocument();

    // Input displays the value
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
  });

  it('calls onChange with only numeric characters', () => {
    const handleChange = jest.fn();

    render(
      <NumberField
        label="Phone"
        value=""
        rows={1}
        onChange={handleChange}
        disabled={false}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'abc123!@#456' },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('123456');
  });

  it('returns empty string when no numeric characters are entered', () => {
    const handleChange = jest.fn();

    render(
      <NumberField
        label="Only numbers"
        value=""
        rows={1}
        onChange={handleChange}
        disabled={false}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'abcdef' },
    });

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('renders empty string when value is undefined', () => {
    render(
      <NumberField
        label="Quantity"
        rows={1}
        onChange={jest.fn()}
        disabled={false}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('disables the input when disabled is true', () => {
    render(
      <NumberField
        label="Disabled Number"
        value="100"
        rows={1}
        onChange={jest.fn()}
        disabled={true}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
