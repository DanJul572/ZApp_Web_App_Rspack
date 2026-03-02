import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import Time from '@/components/input/Time';

// Mock TimePicker
jest.mock('@mui/x-date-pickers', () => ({
  TimePicker: jest.fn((props) => {
    const { value, onChange, disabled } = props;

    return (
      <input
        type="time"
        data-testid="time-picker"
        disabled={disabled}
        value={value ? value.format('HH:mm') : ''}
        onChange={(e) => onChange(dayjs(`2024-01-01 ${e.target.value}`))}
      />
    );
  }),
}));

// LocalizationProvider must still render children
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: jest.fn(),
}));

describe('Time Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    render(<Time label="Start Time" />);

    expect(screen.getByText('Start Time')).toBeInTheDocument();
  });

  it('renders time picker with formatted value', () => {
    render(<Time label="Start Time" value="01-01-2001 14:30" />);

    const picker = screen.getByTestId('time-picker');
    expect(picker).toHaveValue('14:30');
  });

  it('passes disabled prop to TimePicker', () => {
    render(<Time label="Start Time" disabled />);

    const picker = screen.getByTestId('time-picker');
    expect(picker).toBeDisabled();
  });

  it('calls onChange with formatted time value', () => {
    const handleChange = jest.fn();

    render(<Time label="Start Time" onChange={handleChange} />);

    const picker = screen.getByTestId('time-picker');

    fireEvent.change(picker, {
      target: { value: '09:45' },
    });

    expect(handleChange).toHaveBeenCalledWith('09:45');
  });

  it('handles null value safely', () => {
    render(<Time label="Start Time" value={null} />);

    const picker = screen.getByTestId('time-picker');
    expect(picker).toHaveValue('');
  });
});
