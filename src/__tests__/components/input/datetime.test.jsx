import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Datetime from '@/components/input/Datetime';

jest.mock('@mui/x-date-pickers/DateTimePicker', () => ({
  DateTimePicker: ({ onChange, value, disabled }) => (
    <div>
      <input
        data-testid="mock-input"
        value={value ? value.format('DD MMM YYYY HH:mm:ss') : ''}
        disabled={disabled}
        readOnly
      />
      <button
        type="button"
        onClick={() => onChange(new Date('2024-06-01T08:00:00'))}
      >
        Change Date
      </button>
    </div>
  ),
}));

describe('Datetime Input Component', () => {
  it('renders label', () => {
    render(<Datetime label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<Datetime label="Date" value="2024-06-01 08:00:00" />);
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveValue('01 Jun 2024 08:00:00');
  });

  it('calls onChange with formatted date', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Datetime label="Date" onChange={handleChange} />);

    const button = screen.getByText('Change Date');
    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith('2024-06-01T08:00:00');
  });

  it('disables input when disabled prop is true', () => {
    render(<Datetime label="Date" disabled />);
    const input = screen.getByTestId('mock-input');
    expect(input).toBeDisabled();
  });
});
