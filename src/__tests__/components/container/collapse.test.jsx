import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Collapse from '@/components/container/Collapse';

// Mock the MuiCollapse alias
jest.mock('@/aliases/MuiCollapse', () => {
  return ({ in: open, children }) => (
    <div data-testid="mui-collapse" data-open={open}>
      {open ? children : null}
    </div>
  );
});

describe('Collapse Container Component', () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  });

  const renderWithTheme = (ui) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  test('renders label', () => {
    renderWithTheme(<Collapse label="Section Title">Content</Collapse>);

    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  test('renders children when open by default', () => {
    renderWithTheme(<Collapse label="Label">My Content</Collapse>);

    const collapse = screen.getByTestId('mui-collapse');
    expect(collapse).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('My Content')).toBeInTheDocument();
  });

  test('toggles open/close when clicking icon button', () => {
    renderWithTheme(<Collapse label="Test">Content Here</Collapse>);

    const button = screen.getByRole('button');

    // Initially open
    expect(screen.getByTestId('mui-collapse')).toHaveAttribute(
      'data-open',
      'true',
    );
    expect(screen.getByTestId('mui-collapse')).toHaveTextContent(
      'Content Here',
    );

    // Click to close
    fireEvent.click(button);
    expect(screen.getByTestId('mui-collapse')).toHaveAttribute(
      'data-open',
      'false',
    );

    // Click to reopen
    fireEvent.click(button);
    expect(screen.getByTestId('mui-collapse')).toHaveAttribute(
      'data-open',
      'true',
    );
  });

  test('shows KeyboardArrowDown when open and KeyboardArrowRight when closed', () => {
    renderWithTheme(<Collapse label="Arrows">Content</Collapse>);

    const button = screen.getByRole('button');

    // Down arrow should be present initially
    expect(screen.getByTestId('KeyboardArrowDownIcon')).toBeInTheDocument();

    // Click to close → should show Right arrow
    fireEvent.click(button);
    expect(screen.getByTestId('KeyboardArrowRightIcon')).toBeInTheDocument();
  });

  test('applies custom color if provided', () => {
    const customColor = '#ff0000';

    const { container } = renderWithTheme(
      <Collapse label="Colored" color={customColor}>
        Content
      </Collapse>,
    );

    const outerBox = container.firstChild;

    expect(outerBox).toHaveStyle(`border-color: ${customColor}`);
  });
});
