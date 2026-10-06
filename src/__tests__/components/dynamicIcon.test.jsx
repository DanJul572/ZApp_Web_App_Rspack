import { render, screen } from '@testing-library/react';
import DynamicIcon from '@/components/dynamicIcon';
import { formatIconName, parseIconName } from '@/helpers/parseIconName';

describe('parseIconName', () => {
  test.each([
    [null, null],
    ['', null],
    ['home', { symbol: 'home', variant: 'filled' }],
    ['home:outlined', { symbol: 'home', variant: 'outlined' }],
    ['home:rounded', { symbol: 'home', variant: 'rounded' }],
    ['home:sharp', { symbol: 'home', variant: 'sharp' }],
    ['home:unknown', { symbol: 'home', variant: 'filled' }],
    ['Home', { symbol: 'home', variant: 'filled' }],
    [
      'FormatListBulleted',
      { symbol: 'format_list_bulleted', variant: 'filled' },
    ],
    [
      'InsertDriveFileOutlined',
      { symbol: 'insert_drive_file', variant: 'outlined' },
    ],
    ['ViewQuiltRounded', { symbol: 'view_quilt', variant: 'rounded' }],
    ['DeleteSharp', { symbol: 'delete', variant: 'sharp' }],
    ['WarningTwoTone', { symbol: 'warning', variant: 'outlined' }],
    ['Looks3', { symbol: 'looks_3', variant: 'filled' }],
  ])('parses %p', (value, expected) => {
    expect(parseIconName(value)).toEqual(expected);
  });

  test('formatIconName omits the variant for filled icons', () => {
    expect(formatIconName('home', 'filled')).toBe('home');
    expect(formatIconName('home', 'sharp')).toBe('home:sharp');
  });
});

describe('DynamicIcon', () => {
  test('renders nothing without a name', () => {
    const { container } = render(<DynamicIcon />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders filled icon with the outlined font family', () => {
    render(<DynamicIcon name="home" />);
    const icon = screen.getByText('home');
    expect(icon).toHaveClass('material-symbols-outlined');
    expect(icon).toHaveStyle({ fontVariationSettings: "'FILL' 1" });
  });

  test('renders outlined icon without fill', () => {
    render(<DynamicIcon name="home:outlined" />);
    const icon = screen.getByText('home');
    expect(icon).toHaveClass('material-symbols-outlined');
    expect(icon).toHaveStyle({ fontVariationSettings: "'FILL' 0" });
  });

  test('renders rounded and sharp with their own font family', () => {
    render(
      <>
        <DynamicIcon name="folder:rounded" />
        <DynamicIcon name="delete:sharp" />
      </>,
    );
    expect(screen.getByText('folder')).toHaveClass('material-symbols-rounded');
    expect(screen.getByText('delete')).toHaveClass('material-symbols-sharp');
  });

  test('converts legacy MUI names', () => {
    render(<DynamicIcon name="FormatListBulleted" />);
    expect(screen.getByText('format_list_bulleted')).toBeInTheDocument();
  });
});
