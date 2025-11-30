import { render } from '@testing-library/react';
import Gauge from '@/components/chart/Gaude';

// Mock MuiGauge to verify props
jest.mock('@/aliases/MuiGauge', () => (props) => {
  return (
    <div data-testid="mui-gauge">
      <span data-testid="value">{props.value}</span>
      <span data-testid="height">{props.height}</span>
      <span data-testid="text">
        {props.text({ value: props.value, valueMax: 100 })}
      </span>
    </div>
  );
});

// Mock @mui/x-charts/Gauge to avoid ESM import issues
jest.mock('@mui/x-charts/Gauge', () => ({
  __esModule: true,
  gaugeClasses: { valueText: 'gauge-value-text' },
}));

describe('Gauge Chart Component', () => {
  it('renders MuiGauge with correct props', () => {
    const { getByTestId } = render(<Gauge value={42} />);
    expect(getByTestId('mui-gauge')).toBeInTheDocument();
    expect(getByTestId('value').textContent).toBe('42');
    expect(getByTestId('height').textContent).toBe('250');
    expect(getByTestId('text').textContent).toBe('42 / 100');
  });

  it('defaults value to 0 if not provided', () => {
    const { getByTestId } = render(<Gauge />);
    expect(getByTestId('value').textContent).toBe('0');
  });
});
