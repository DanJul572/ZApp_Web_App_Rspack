import { SvgIcon } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import LeftBorderCard from '@/components/custom/LeftBorderCard';

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('LeftBorderCard Custom Component', () => {
  it('renders with default props', () => {
    renderWithTheme(<LeftBorderCard />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders with custom title and value', () => {
    renderWithTheme(<LeftBorderCard title="Custom Title" value="123" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    renderWithTheme(<LeftBorderCard title="Color Test" color="#ff0000" />);
    const title = screen.getByText('Color Test');
    expect(title).toHaveStyle('color: #ff0000');
  });

  it('renders icon when provided', () => {
    const TestIcon = (props) => (
      <SvgIcon data-testid="test-icon" {...props}>
        <circle cx="12" cy="12" r="10" />
      </SvgIcon>
    );
    renderWithTheme(<LeftBorderCard icon={<TestIcon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
