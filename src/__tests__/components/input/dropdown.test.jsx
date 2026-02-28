import { useQuery } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import Dropdown from '@/components/input/Dropdown';
import Request from '@/hooks/Request';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

const config = {
  api: {
    common: {
      options: '/common/options',
    },
  },
};

jest.mock('@mui/material/Box', () => ({ children, sx: _sx, ...rest }) => (
  <div {...rest}>{children}</div>
));

jest.mock('@mui/material/Typography', () => ({ children, ...rest }) => (
  <span {...rest}>{children}</span>
));

jest.mock('@mui/material/TextField', () => ({ placeholder, inputProps }) => (
  <input placeholder={placeholder} {...inputProps} />
));

jest.mock('@mui/material/List', () => ({ children, ...rest }) => (
  <li {...rest}>{children}</li>
));

jest.mock('@mui/material/Autocomplete', () => ({
  __esModule: true,
  default: ({ options, onChange, value, disabled, multiple, renderInput }) => {
    const handleChange = (e) => {
      if (multiple) {
        const selected = Array.from(e.target.selectedOptions).map((o) =>
          options.find((opt) => opt.value === o.value),
        );
        onChange(e, selected);
      } else {
        const selected =
          options.find((o) => o.value === e.target.value) ?? null;
        onChange(e, selected);
      }
    };

    const selectValue = multiple
      ? (value ?? []).map((v) => v?.value ?? v)
      : (value?.value ?? '');

    return (
      <div>
        {renderInput({ inputProps: { 'data-testid': 'autocomplete-input' } })}
        <select
          data-testid="autocomplete-select"
          disabled={disabled}
          multiple={multiple}
          onChange={handleChange}
          value={selectValue}
        >
          {(options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
}));

jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => ({ config }),
}));

jest.mock('@/hooks/Request', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const defaultQuery = (override = {}) =>
  useQuery.mockReturnValue({ data: undefined, isLoading: false, ...override });

describe('Dropdown Component', () => {
  beforeEach(() => defaultQuery());

  it('renders label and combobox', () => {
    render(
      <Dropdown
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-select')).toBeInTheDocument();
  });

  it('renders all provided options', () => {
    render(
      <Dropdown label="Test" options={options} value="" onChange={() => {}} />,
    );

    options.forEach(({ label }) => {
      expect(screen.getByRole('option', { name: label })).toBeInTheDocument();
    });
  });

  it('renders loading state when isLoading is true', () => {
    defaultQuery({ isLoading: true });

    render(<Dropdown label="Test" value="" onChange={() => {}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('autocomplete-select')).not.toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(
      <Dropdown
        label="Test"
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Pick one"
      />,
    );

    expect(screen.getByPlaceholderText('Pick one')).toBeInTheDocument();
  });

  it('disables the select when disabled prop is true', () => {
    render(
      <Dropdown
        label="Disabled"
        options={options}
        value=""
        onChange={() => {}}
        disabled
      />,
    );

    expect(screen.getByTestId('autocomplete-select')).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(
      <Dropdown label="Test" options={options} value="" onChange={() => {}} />,
    );

    expect(screen.getByTestId('autocomplete-select')).not.toBeDisabled();
  });

  it('calls onChange with the option value on single selection', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Test"
        options={options}
        value=""
        onChange={handleChange}
      />,
    );

    fireEvent.change(screen.getByTestId('autocomplete-select'), {
      target: { value: '1' },
    });

    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('calls onChange with null when selection is cleared (single)', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Test"
        options={options}
        value="1"
        onChange={handleChange}
      />,
    );

    fireEvent.change(screen.getByTestId('autocomplete-select'), {
      target: { value: '' },
    });

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('reflects the current value in single mode', () => {
    render(
      <Dropdown
        label="Test"
        options={[
          { value: '10', label: 'Ten' },
          { value: '20', label: 'Twenty' },
        ]}
        value="20"
        onChange={() => {}}
      />,
    );

    expect(screen.getByTestId('autocomplete-select')).toHaveValue('20');
  });

  it('calls onChange with pipe-separated values in multiple mode', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Multi"
        options={options}
        value=""
        onChange={handleChange}
        multiple
      />,
    );

    const select = screen.getByTestId('autocomplete-select');

    Array.from(select.options).forEach((opt) => {
      opt.selected = true;
    });
    fireEvent.change(select);

    expect(handleChange).toHaveBeenCalledWith('1|2');
  });

  it('renders a multiple select element when multiple prop is true', () => {
    render(
      <Dropdown
        label="Multi"
        options={options}
        value=""
        onChange={() => {}}
        multiple
      />,
    );

    expect(screen.getByTestId('autocomplete-select')).toHaveAttribute(
      'multiple',
    );
  });

  it('fetches options via API when id is provided and no options prop', () => {
    const mockedGet = jest
      .fn()
      .mockResolvedValue({ data: [{ value: '3', label: 'Fetched 3' }] });

    Request.mockReturnValue({ get: mockedGet });

    useQuery.mockImplementation(({ queryFn, enabled }) => {
      if (enabled) queryFn();
      return { data: undefined, isLoading: false };
    });

    render(<Dropdown label="Test" id="abc" value="" onChange={() => {}} />);

    expect(mockedGet).toHaveBeenCalledWith(config.api.common.options, {
      id: 'abc',
    });
  });

  it('does not fetch from API when options prop is provided', () => {
    const mockedGet = jest.fn();
    Request.mockReturnValue({ get: mockedGet });

    let capturedEnabled;
    useQuery.mockImplementation(({ enabled }) => {
      capturedEnabled = enabled;
      return { data: undefined, isLoading: false };
    });

    render(
      <Dropdown
        label="Test"
        id="abc"
        options={options}
        value=""
        onChange={() => {}}
      />,
    );

    expect(capturedEnabled).toBe(false);
    expect(mockedGet).not.toHaveBeenCalled();
  });
});
