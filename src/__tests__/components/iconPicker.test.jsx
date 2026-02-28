import { act, fireEvent, render, screen } from '@testing-library/react';
import IconPicker from '@/components/iconPicker';
import * as Icons from '@/configs/CIcons';

jest.mock('@mui/material/Box', () => ({ children, sx: _sx, ...rest }) => (
  <div {...rest}>{children}</div>
));

jest.mock(
  '@mui/material/FormControl',
  () =>
    ({ children, size: _s, sx: _sx, ...rest }) => (
      <div {...rest}>{children}</div>
    ),
);

jest.mock(
  '@mui/material/Select',
  () =>
    ({ value, onChange, children, ...rest }) => (
      <select value={value} onChange={(e) => onChange?.(e)} {...rest}>
        {children}
      </select>
    ),
);

jest.mock('@mui/material/MenuItem', () => ({ value, children, ...rest }) => (
  <option value={value} {...rest}>
    {children}
  </option>
));

jest.mock(
  '@mui/material/TextField',
  () =>
    ({ placeholder, value, onChange, size: _s, fullWidth: _fw, ...rest }) => (
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    ),
);

jest.mock(
  '@mui/material/IconButton',
  () =>
    ({ children, onClick, onBlur, color: _c, ...rest }) => (
      <button onClick={onClick} onBlur={onBlur} {...rest}>
        {children}
      </button>
    ),
);

jest.mock('react-virtualized', () => ({
  AutoSizer: ({ children }) => children({ width: 300, height: 300 }),
  Grid: ({ cellRenderer, columnCount, rowCount }) => (
    <div data-testid="grid">
      {Array.from({ length: rowCount }).map((_, row) =>
        Array.from({ length: columnCount }).map((_, col) =>
          cellRenderer({
            rowIndex: row,
            columnIndex: col,
            key: `${row}-${col}`,
            style: {},
          }),
        ),
      )}
    </div>
  ),
}));

describe('IconPicker Component', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('renders filter select and search input', () => {
    render(<IconPicker />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('renders filled icons from CIcons by default', () => {
    render(<IconPicker />);
    const filledIcons = Object.keys(Icons).filter(
      (name) =>
        !name.endsWith('Outlined') &&
        !name.endsWith('Rounded') &&
        !name.endsWith('TwoTone') &&
        !name.endsWith('Sharp'),
    );
    filledIcons.forEach((iconName) => {
      expect(screen.getByTestId(`icon-button-${iconName}`)).toBeInTheDocument();
    });
  });

  test('calls onSelect with icon name when an icon button is clicked', () => {
    const onSelect = jest.fn();
    render(<IconPicker onSelect={onSelect} />);

    const firstFilledIcon = Object.keys(Icons).find(
      (name) =>
        !name.endsWith('Outlined') &&
        !name.endsWith('Rounded') &&
        !name.endsWith('TwoTone') &&
        !name.endsWith('Sharp'),
    );

    fireEvent.click(screen.getByTestId(`icon-button-${firstFilledIcon}`));
    expect(onSelect).toHaveBeenCalledWith(firstFilledIcon);
  });

  test('calls onBlur with icon name when an icon button loses focus', () => {
    const onBlur = jest.fn();
    render(<IconPicker onBlur={onBlur} />);

    const firstFilledIcon = Object.keys(Icons).find(
      (name) =>
        !name.endsWith('Outlined') &&
        !name.endsWith('Rounded') &&
        !name.endsWith('TwoTone') &&
        !name.endsWith('Sharp'),
    );
    const btn = screen.getByTestId(`icon-button-${firstFilledIcon}`);

    act(() => {
      btn.focus();
      fireEvent.blur(btn);
    });

    expect(onBlur).toHaveBeenCalledWith(firstFilledIcon);
  });

  test('filters icons by search term after debounce delay', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'zzz_no_match_yet' },
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText('No icon found.')).toBeInTheDocument();
  });

  test('shows matching icon after debounce when search term matches', () => {
    const filledIcons = Object.keys(Icons).filter(
      (name) =>
        !name.endsWith('Outlined') &&
        !name.endsWith('Rounded') &&
        !name.endsWith('TwoTone') &&
        !name.endsWith('Sharp'),
    );
    const targetIcon = filledIcons[0];

    render(<IconPicker />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: targetIcon },
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId(`icon-button-${targetIcon}`)).toBeInTheDocument();
  });

  test('shows "No icon found." when search yields no results', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'xxx_not_existing' },
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText('No icon found.')).toBeInTheDocument();
  });

  test('filter select: choosing "TwoTone" shows only TwoTone icons', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'twoTone' },
    });

    const twoToneIcons = Object.keys(Icons).filter((i) =>
      i.endsWith('TwoTone'),
    );
    twoToneIcons.forEach((name) => {
      expect(screen.getByTestId(`icon-button-${name}`)).toBeInTheDocument();
    });

    const nonTwoTone = Object.keys(Icons).filter((i) => !i.endsWith('TwoTone'));
    nonTwoTone.forEach((name) => {
      expect(
        screen.queryByTestId(`icon-button-${name}`),
      ).not.toBeInTheDocument();
    });
  });

  test('filter select: choosing "Outlined" shows only Outlined icons', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'outlined' },
    });

    const outlinedIcons = Object.keys(Icons).filter((i) =>
      i.endsWith('Outlined'),
    );
    outlinedIcons.forEach((name) => {
      expect(screen.getByTestId(`icon-button-${name}`)).toBeInTheDocument();
    });

    const nonOutlined = Object.keys(Icons).filter(
      (i) => !i.endsWith('Outlined'),
    );
    nonOutlined.forEach((name) => {
      expect(
        screen.queryByTestId(`icon-button-${name}`),
      ).not.toBeInTheDocument();
    });
  });

  test('filter select: choosing "Rounded" shows only Rounded icons', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'rounded' },
    });

    const roundedIcons = Object.keys(Icons).filter((i) =>
      i.endsWith('Rounded'),
    );
    roundedIcons.forEach((name) => {
      expect(screen.getByTestId(`icon-button-${name}`)).toBeInTheDocument();
    });
  });

  test('filter select: choosing "Sharp" shows only Sharp icons', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'sharp' },
    });

    const sharpIcons = Object.keys(Icons).filter((i) => i.endsWith('Sharp'));
    sharpIcons.forEach((name) => {
      expect(screen.getByTestId(`icon-button-${name}`)).toBeInTheDocument();
    });
  });

  test('combining filter and search term narrows results correctly', () => {
    const outlinedIcons = Object.keys(Icons).filter((i) =>
      i.endsWith('Outlined'),
    );
    if (outlinedIcons.length === 0) return; // skip if no outlined icons exist

    const targetIcon = outlinedIcons[0]; // e.g. "AccessAlarmOutlined"
    const baseName = targetIcon.replace('Outlined', ''); // e.g. "AccessAlarm"

    render(<IconPicker />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'outlined' },
    });

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: baseName },
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId(`icon-button-${targetIcon}`)).toBeInTheDocument();

    const filledExists = Object.keys(Icons).some((i) => i === baseName);
    if (filledExists) {
      expect(
        screen.queryByTestId(`icon-button-${baseName}`),
      ).not.toBeInTheDocument();
    }
  });

  test('onSelect is not called when clicking icon if onSelect prop is not provided', () => {
    render(<IconPicker />);
    const firstFilledIcon = Object.keys(Icons).find(
      (name) =>
        !name.endsWith('Outlined') &&
        !name.endsWith('Rounded') &&
        !name.endsWith('TwoTone') &&
        !name.endsWith('Sharp'),
    );
    expect(() =>
      fireEvent.click(screen.getByTestId(`icon-button-${firstFilledIcon}`)),
    ).not.toThrow();
  });
});
