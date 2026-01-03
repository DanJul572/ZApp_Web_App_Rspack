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
      detail: '/common/detail',
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

describe('Dropdown Input Component', () => {
  beforeEach(() => {
    useQuery.mockReturnValue({
      data: options,
      isLoading: false,
    });
  });

  it('renders label and options', () => {
    render(
      <Dropdown
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with disabled prop', () => {
    render(
      <Dropdown
        label="Disabled"
        options={options}
        value=""
        onChange={() => {}}
        disabled
      />,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onChange when option is selected (single)', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Test Label"
        options={options}
        value=""
        onChange={handleChange}
      />,
    );
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Option 1' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalled();
  });

  it('supports multiple selection', () => {
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
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Option 1' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders loading state', () => {
    useQuery.mockReturnValueOnce({
      data: [],
      isLoading: true,
    });

    render(<Dropdown label="Test" value="" onChange={() => {}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches options via API when id is provided and no options prop', async () => {
    const mockedGet = jest
      .fn()
      .mockResolvedValue([{ value: '3', label: 'Fetched 3' }]);

    Request.mockReturnValue({
      get: mockedGet,
    });

    useQuery.mockImplementation(({ queryFn }) => ({
      data: queryFn(),
      isLoading: false,
    }));

    render(<Dropdown label="Test" id="abc" value="" onChange={() => {}} />);

    expect(mockedGet).toHaveBeenCalledWith(
      config.api.common.options,
      { id: 'abc' },
      false,
    );
  });

  it('sets correct value when single selection and value matches option', () => {
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

    const combobox = screen.getByRole('combobox');

    expect(combobox.value).toBe('Twenty');
  });
  it('executes isOptionEqualToValue comparator', () => {
    const opts = [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
    ];

    render(
      <Dropdown label="Test" options={opts} value="1" onChange={() => {}} />,
    );

    const ac = screen.getByRole('combobox');

    expect(ac.value).toBe('One');
  });
});
