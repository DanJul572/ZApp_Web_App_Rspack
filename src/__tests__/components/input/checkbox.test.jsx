import { fireEvent, render, screen } from '@testing-library/react';
import Checkbox from '@/components/input/Checkbox';

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

describe('Checkbox Input Component', () => {
  test('renders label and options', () => {
    render(
      <Checkbox
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    options.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeInTheDocument();
    });
  });

  test('checks checkboxes based on value string', () => {
    render(
      <Checkbox options={options} value="opt1|opt3" onChange={() => {}} />,
    );

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    expect(screen.getByLabelText('Option 3')).toBeChecked();
  });

  test('calls onChange with updated values when toggled', () => {
    const handleChange = jest.fn();
    render(<Checkbox options={options} value="opt1" onChange={handleChange} />);

    const option2 = screen.getByLabelText('Option 2');
    fireEvent.click(option2);

    expect(handleChange).toHaveBeenCalledWith('opt1|opt2');
  });

  test('disables all checkboxes when disabled prop is true', () => {
    render(
      <Checkbox
        options={options}
        value=""
        disabled={true}
        onChange={() => {}}
      />,
    );

    options.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeDisabled();
    });
  });
});
