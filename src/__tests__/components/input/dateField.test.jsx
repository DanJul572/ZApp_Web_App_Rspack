import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateField from '@/components/input/DateField';

const config = {
  format: {
    time: {
      display: 'HH:mm:ss',
      value: '1901-01-01THH:mm:ss',
    },
    date: {
      display: 'DD/MM/YYYY',
      value: 'YYYY-MM-DDT00:00:00',
    },
    datetime: {
      display: 'DD MMM YYYY HH:mm:ss',
      value: 'YYYY-MM-DDTHH:mm:ss',
    },
  },
};

jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => {
    return {
      config: config,
    };
  },
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ onChange, value, disabled }) => (
    <div>
      <input
        data-testid="mock-date-input"
        value={value ? value.format('DD/MM/YYYY') : ''}
        disabled={disabled}
        readOnly
      />
      <button type="button" onClick={() => onChange(new Date('2024-06-01'))}>
        Change Date
      </button>
    </div>
  ),
}));

describe('DateField Input Component', () => {
  it('renders label', () => {
    render(<DateField label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<DateField label="Date" value="2024-06-01" />);
    const input = screen.getByTestId('mock-date-input');
    expect(input).toHaveValue('01/06/2024');
  });

  it('calls onChange with formatted date', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<DateField label="Date" onChange={handleChange} />);

    const button = screen.getByText('Change Date');
    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith('2024-06-01T00:00:00');
  });

  it('disables input when disabled prop is true', () => {
    render(<DateField label="Date" disabled />);
    const input = screen.getByTestId('mock-date-input');
    expect(input).toBeDisabled();
  });
});
