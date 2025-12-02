import { fireEvent, render, screen } from '@testing-library/react';
import FullScreen from '@/components/dialog/FullScreen';

describe('FullScreen Dialog Container', () => {
  it('renders children when open', () => {
    render(
      <FullScreen open={true} setOpen={jest.fn()}>
        <div>Dialog Content</div>
      </FullScreen>,
    );
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(
      <FullScreen open={false} setOpen={jest.fn()}>
        <div>Dialog Content</div>
      </FullScreen>,
    );
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('calls setOpen(false) when close button is clicked', () => {
    const setOpen = jest.fn();
    render(
      <FullScreen open={true} setOpen={setOpen}>
        <div>Dialog Content</div>
      </FullScreen>,
    );
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
