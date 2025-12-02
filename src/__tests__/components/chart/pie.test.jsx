import { render, screen } from '@testing-library/react';
import Pie from '@/components/chart/Pie';

// Mock Translator hook to return the key for simplicity
jest.mock('@/hooks/Translator', () => () => (key) => key);

// Mock PieChart to avoid ESM import issues
jest.mock('@mui/x-charts/PieChart', () => ({
  __esModule: true,
  PieChart: (props) => (
    <svg role="img" aria-label="Pie Chart">
      {props.series?.[0]?.data?.map((item) => (
        <circle
          key={item.value}
          data-testid={`pie-value-${item.value}`}
          data-value={item.value}
        />
      ))}
    </svg>
  ),
}));

describe('Pie Chart Component', () => {
  it('renders PieChart with valid values', () => {
    const values = [
      { value: 10, label: 'A' },
      { value: 20, label: 'B' },
      { value: 30, label: 'C' },
    ];
    render(<Pie values={values} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    values.forEach((item) => {
      expect(screen.getByTestId(`pie-value-${item.value}`)).toHaveAttribute(
        'data-value',
        item.value.toString(),
      );
    });
  });

  it('renders empty content message when values are missing', () => {
    render(<Pie values={[]} />);
    expect(screen.getByText('empty_content')).toBeInTheDocument();
  });
});
