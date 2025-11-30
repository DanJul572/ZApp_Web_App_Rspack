import { render, screen } from '@testing-library/react';
import Line from '@/components/chart/Line';

// Mock Translator hook to return the key for simplicity
jest.mock('@/hooks/Translator', () => () => (key) => key);

// Mock Typography to avoid MUI issues
jest.mock('@mui/material/Typography', () => (props) => {
  const { children } = props;
  return <span>{children}</span>;
});

// Mock LineChart to avoid ESM import issues
jest.mock('@mui/x-charts/LineChart', () => ({
  __esModule: true,
  LineChart: (props) => (
    <svg role="img" aria-label="Line Chart">
      {props.xAxis?.[0]?.data?.map((label) => (
        <text key={label}>{label}</text>
      ))}
      {props.series?.[0]?.data?.map((value) => (
        <circle key={value} data-value={value} />
      ))}
    </svg>
  ),
}));

describe('Line Chart Component', () => {
  it('renders LineChart with valid labels and values', () => {
    const labels = ['Jan', 'Feb', 'Mar'];
    const values = [10, 20, 30];
    render(<Line labels={labels} values={values} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    values.forEach((value) => {
      expect(
        screen.getByRole('img').querySelector(`[data-value="${value}"]`),
      ).toBeInTheDocument();
    });
  });

  it('renders empty content message when labels or values are missing', () => {
    render(<Line labels={[]} values={[]} />);
    expect(screen.getByText('empty_content')).toBeInTheDocument();
  });
});
