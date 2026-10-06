import { act, fireEvent, render, screen } from '@testing-library/react';
import IconPicker from '@/components/iconPicker';

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

jest.mock('@/configs/iconNames.json', () => [
  'home',
  'format_list_bulleted',
  'folder',
  'delete',
]);

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

  const search = (value) => {
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value },
    });
    act(() => jest.advanceTimersByTime(1000));
  };

  test('renders filter select and search input', async () => {
    render(<IconPicker />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    await screen.findByTestId('icon-button-home');
  });

  test('shows loading text until icon names are loaded', async () => {
    render(<IconPicker />);
    expect(screen.getByText('Loading icons...')).toBeInTheDocument();
    await screen.findByTestId('icon-button-home');
    expect(screen.queryByText('Loading icons...')).not.toBeInTheDocument();
  });

  test('renders all icons as filled by default', async () => {
    render(<IconPicker />);
    for (const name of ['home', 'format_list_bulleted', 'folder', 'delete']) {
      expect(
        await screen.findByTestId(`icon-button-${name}`),
      ).toBeInTheDocument();
    }
  });

  test('does not offer the TwoTone filter', () => {
    render(<IconPicker />);
    expect(screen.queryByText('TwoTone')).not.toBeInTheDocument();
  });

  test('calls onSelect with icon name when an icon button is clicked', async () => {
    const onSelect = jest.fn();
    render(<IconPicker onSelect={onSelect} />);

    fireEvent.click(await screen.findByTestId('icon-button-home'));
    expect(onSelect).toHaveBeenCalledWith('home');
  });

  test('calls onBlur with icon name when an icon button loses focus', async () => {
    const onBlur = jest.fn();
    render(<IconPicker onBlur={onBlur} />);

    const btn = await screen.findByTestId('icon-button-folder');
    act(() => {
      btn.focus();
      fireEvent.blur(btn);
    });

    expect(onBlur).toHaveBeenCalledWith('folder');
  });

  test('filters icons by search term after debounce delay', async () => {
    render(<IconPicker />);
    await screen.findByTestId('icon-button-home');

    search('folder');

    expect(screen.getByTestId('icon-button-folder')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-button-home')).not.toBeInTheDocument();
  });

  test('search accepts spaces and PascalCase', async () => {
    render(<IconPicker />);
    await screen.findByTestId('icon-button-home');

    search('list bulleted');
    expect(
      screen.getByTestId('icon-button-format_list_bulleted'),
    ).toBeInTheDocument();

    search('FormatList');
    expect(
      screen.getByTestId('icon-button-format_list_bulleted'),
    ).toBeInTheDocument();
  });

  test('shows "No icon found." when search yields no results', async () => {
    render(<IconPicker />);
    await screen.findByTestId('icon-button-home');

    search('xxx_not_existing');

    expect(screen.getByText('No icon found.')).toBeInTheDocument();
  });

  test.each([
    'outlined',
    'rounded',
    'sharp',
  ])('filter select: choosing "%s" suffixes icon names with the variant', async (variant) => {
    const onSelect = jest.fn();
    render(<IconPicker onSelect={onSelect} />);
    await screen.findByTestId('icon-button-home');

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: variant },
    });

    expect(screen.queryByTestId('icon-button-home')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`icon-button-home:${variant}`));
    expect(onSelect).toHaveBeenCalledWith(`home:${variant}`);
  });

  test('combining filter and search term narrows results correctly', async () => {
    render(<IconPicker />);
    await screen.findByTestId('icon-button-home');

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'outlined' },
    });
    search('del');

    expect(
      screen.getByTestId('icon-button-delete:outlined'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('icon-button-folder:outlined'),
    ).not.toBeInTheDocument();
  });

  test('initial filter follows the variant of the active icon', async () => {
    render(<IconPicker active="folder:sharp" />);
    expect(screen.getByRole('combobox')).toHaveValue('sharp');
    expect(
      await screen.findByTestId('icon-button-folder:sharp'),
    ).toBeInTheDocument();
  });

  test('legacy MUI active name selects the matching filter', async () => {
    render(<IconPicker active="FolderOutlined" />);
    expect(screen.getByRole('combobox')).toHaveValue('outlined');
    expect(
      await screen.findByTestId('icon-button-folder:outlined'),
    ).toBeInTheDocument();
  });

  test('clicking an icon does not throw when onSelect is not provided', async () => {
    render(<IconPicker />);
    const btn = await screen.findByTestId('icon-button-home');
    expect(() => fireEvent.click(btn)).not.toThrow();
  });
});
