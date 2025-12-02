import { render, screen } from '@testing-library/react';
import Bar from '@/components/chart/Bar';

// Mock Translator hook to return the key for simplicity
jest.mock('@/hooks/Translator', () => () => (key) => key);

jest.mock('@mui/x-charts/BarChart', () => ({
  __esModule: true,
  BarChart: (props) => (
    <svg role="img" aria-label="Bar Chart">
      {props.xAxis?.[0]?.data?.map((label) => (
        <text key={label}>{label}</text>
      ))}
    </svg>
  ),
}));

describe('Bar Chart Component', () => {
  it('renders BarChart with valid labels and values', () => {
    const labels = ['A', 'B', 'C'];
    const values = [10, 20, 30];
    render(<Bar labels={labels} values={values} />);

    expect(screen.getByRole('img')).toBeInTheDocument();

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders empty content message when labels or values are missing', () => {
    render(<Bar labels={[]} values={[]} />);
    expect(screen.getByText('empty_content')).toBeInTheDocument();
  });
});
