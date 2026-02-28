import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortText from '@/components/input/ShortText';
import { validator } from '@/helpers/validator';

jest.mock(
  '@mui/material/Box',
  () =>
    ({
      children,
      display: _display,
      justifyContent: _jc,
      alignItems: _ai,
      sx: _sx,
      ...rest
    }) => <div {...rest}>{children}</div>,
);

jest.mock('@mui/material/Typography', () => ({ children, ...rest }) => (
  <span {...rest}>{children}</span>
));

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    error,
    helperText,

    variant: _v,
    fullWidth: _fw,
    ...rest
  }) => (
    <div>
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      {helperText && <span role="alert">{helperText}</span>}
    </div>
  ),
}));

jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({ children, title }) => (
    <div>
      {children}
      <span data-testid="tooltip-title">{title}</span>
    </div>
  ),
}));

jest.mock('@mui/icons-material/Help', () => ({
  __esModule: true,
  default: (props) => <svg data-testid="HelpIcon" {...props} />,
}));

jest.mock('@/helpers/validator', () => ({
  validator: jest.fn(),
}));

describe('ShortText Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    validator.mockReturnValue({ status: false, message: '' });
  });

  it('renders label and input field', () => {
    render(<ShortText label="Name" value="" rules={[]} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with an empty string when value is undefined', () => {
    render(<ShortText label="Name" />);

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('renders the provided value in the input', () => {
    render(<ShortText label="Name" value="John" />);

    expect(screen.getByRole('textbox')).toHaveValue('John');
  });

  it('renders placeholder text when provided', () => {
    render(<ShortText label="Name" value="" placeholder="Enter name" />);

    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders the Help icon and tooltip text when tooltip prop is provided', () => {
    render(<ShortText label="Name" value="" tooltip="Helpful info" />);

    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-title')).toHaveTextContent(
      'Helpful info',
    );
  });

  it('does not render the Help icon when tooltip prop is absent', () => {
    render(<ShortText label="Name" value="" />);

    expect(screen.queryByTestId('HelpIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-title')).not.toBeInTheDocument();
  });

  it('disables the input when disabled prop is true', () => {
    render(<ShortText label="Name" value="" disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(<ShortText label="Name" value="" />);

    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('displays validation error message when validator returns an error', () => {
    validator.mockReturnValue({ status: true, message: 'Field is required' });

    render(<ShortText label="Name" value="" rules={['required']} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
  });

  it('does not display an error message when validator passes', () => {
    render(<ShortText label="Name" value="something" rules={['required']} />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'false',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls validator with the provided rules and value', () => {
    const rules = ['required'];
    render(<ShortText label="Name" value="test" rules={rules} />);

    expect(validator).toHaveBeenCalledWith(rules, 'test');
  });

  it('calls onChange with the input value when user types', () => {
    const handleChange = jest.fn();
    render(<ShortText label="Name" value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'John' },
    });

    expect(handleChange).toHaveBeenCalledWith('John');
  });

  it('does not throw when onChange prop is not provided', () => {
    render(<ShortText label="Name" value="" />);

    expect(() =>
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test' },
      }),
    ).not.toThrow();
  });

  it('calls onBlur with the input value when input loses focus', () => {
    const handleBlur = jest.fn();
    render(<ShortText label="Name" value="" onBlur={handleBlur} />);

    fireEvent.blur(screen.getByRole('textbox'), { target: { value: 'Doe' } });

    expect(handleBlur).toHaveBeenCalledWith('Doe');
  });

  it('does not throw when onBlur prop is not provided', () => {
    render(<ShortText label="Name" value="" />);

    expect(() =>
      fireEvent.blur(screen.getByRole('textbox'), {
        target: { value: 'test' },
      }),
    ).not.toThrow();
  });
});
