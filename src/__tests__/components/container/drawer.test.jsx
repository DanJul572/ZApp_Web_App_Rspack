import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drawer from '@/components/container/Drawer';

// Mock MuiDrawer alias
jest.mock('@/aliases/MuiDrawer', () => {
  return ({ open, onClose, anchor, children }) => (
    <div
      role="none"
      data-testid="mui-drawer"
      data-open={open}
      data-anchor={anchor}
      onClick={onClose}
    >
      {children}
    </div>
  );
});

describe('Drawer Container Component', () => {
  test('renders children', () => {
    render(
      <Drawer open anchor="right">
        Drawer Content
      </Drawer>,
    );
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  test('passes open and anchor to MuiDrawer', () => {
    render(
      <Drawer open anchor="left">
        Content
      </Drawer>,
    );
    const drawer = screen.getByTestId('mui-drawer');

    expect(drawer).toHaveAttribute('data-open', 'true');
    expect(drawer).toHaveAttribute('data-anchor', 'left');
  });

  test('defaults anchor to "right" if not provided', () => {
    render(<Drawer open>Content</Drawer>);
    const drawer = screen.getByTestId('mui-drawer');

    expect(drawer).toHaveAttribute('data-anchor', 'right');
  });

  test('sets width when anchor is left or right', () => {
    const { container } = render(
      <Drawer open anchor="left" size="500">
        Content
      </Drawer>,
    );

    const box = container.querySelector('div[data-testid="mui-drawer"] > div');
    expect(box).toHaveStyle('width: 500px');
  });

  test('sets height when anchor is top or bottom', () => {
    const { container } = render(
      <Drawer open anchor="top" size="600">
        Content
      </Drawer>,
    );

    const box = container.querySelector('div[data-testid="mui-drawer"] > div');
    expect(box).toHaveStyle('height: 600px');
  });

  test('uses default size (750) when size is not provided', () => {
    const { container } = render(
      <Drawer open anchor="left">
        Content
      </Drawer>,
    );

    const box = container.querySelector('div[data-testid="mui-drawer"] > div');
    expect(box).toHaveStyle('width: 750px');
  });

  test('calls setOpen(false) when drawer is closed', () => {
    const setOpen = jest.fn();
    render(
      <Drawer open setOpen={setOpen}>
        Content
      </Drawer>,
    );

    // the mock drawer triggers onClose by clicking itself
    fireEvent.click(screen.getByTestId('mui-drawer'));

    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
