import { act, fireEvent, render, screen } from '@testing-library/react';
import IconPicker from '@/components/iconPicker';
import * as Icons from '@/configs/CIcons';

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
            parentProps: { columnCount },
          }),
        ),
      )}
    </div>
  ),
}));

jest.mock('@mui/material/ButtonBase', () => {
  const ActualButtonBase = jest.requireActual('@mui/material/ButtonBase');
  return {
    __esModule: true,
    default: (props) => <ActualButtonBase.default {...props} disableRipple />,
  };
});

describe('IconPicker Component', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('renders filter and search input', () => {
    render(<IconPicker />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('renders icons from CIcons', () => {
    render(<IconPicker />);
    Object.keys(Icons).forEach((iconName) => {
      expect(screen.getByTestId(`icon-button-${iconName}`)).toBeInTheDocument();
    });
  });

  test('calls onSelect when an icon is clicked', () => {
    const onSelect = jest.fn();
    render(<IconPicker onSelect={onSelect} />);

    const firstIcon = Object.keys(Icons)[0];
    const btn = screen.getByTestId(`icon-button-${firstIcon}`);

    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith(firstIcon);
  });

  test('filters icons using search term with debounce', () => {
    render(<IconPicker />);

    const searchInput = screen.getByPlaceholderText('Search...');

    fireEvent.change(searchInput, { target: { value: 'home' } });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId('icon-button-Home')).toBeInTheDocument();
  });

  test('calls onBlur when icon loses focus', () => {
    const onBlur = jest.fn();
    render(<IconPicker onBlur={onBlur} />);

    const firstIcon = Object.keys(Icons)[0];
    const btn = screen.getByTestId(`icon-button-${firstIcon}`);

    act(() => {
      btn.focus();
      fireEvent.blur(btn);
    });

    expect(onBlur).toHaveBeenCalledWith(firstIcon);
  });

  test('shows "No icon found." when search yields no match', () => {
    render(<IconPicker />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'xxx_not_existing' },
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText('No icon found.')).toBeInTheDocument();
  });

  test('twoTone filter applies "TwoTone" suffix', () => {
    render(<IconPicker />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    fireEvent.click(screen.getByRole('option', { name: 'TwoTone' }));

    const twoToneIcons = Object.keys(Icons).filter((i) =>
      i.endsWith('TwoTone'),
    );

    twoToneIcons.forEach((name) => {
      expect(screen.getByTestId(`icon-button-${name}`)).toBeInTheDocument();
    });
  });

  test('filters icons when filter is changed', () => {
    render(<IconPicker />);

    const select = screen.getByRole('combobox');

    fireEvent.mouseDown(select);
    const outlinedOption = screen.getByRole('option', { name: 'Outlined' });
    fireEvent.click(outlinedOption);

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
});
