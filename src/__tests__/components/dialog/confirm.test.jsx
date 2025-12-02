import { fireEvent, render, screen } from '@testing-library/react';
import Confirm from '@/components/dialog/Confirm';

describe('Confirm Dialog Component', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Title',
    text: 'Are you sure?',
    confirmButton: 'Yes',
    cancelButton: 'No',
    onConfirm: jest.fn(),
  };

  afterEach(() => {
    defaultProps.onConfirm.mockClear();
  });

  it('renders dialog with title and text', () => {
    render(<Confirm {...defaultProps} />);
    expect(screen.getByText('Confirm Title')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onConfirm(false) when cancel button is clicked', () => {
    render(<Confirm {...defaultProps} />);
    fireEvent.click(screen.getByText('No'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(false);
  });

  it('calls onConfirm(true) when confirm button is clicked', () => {
    render(<Confirm {...defaultProps} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(true);
  });

  it('does not render dialog when open is false', () => {
    render(<Confirm {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm Title')).not.toBeInTheDocument();
  });

  it('calls onConfirm(false) when dialog backdrop is clicked', () => {
    render(<Confirm {...defaultProps} />);

    const backdrop = document.querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop);

    expect(defaultProps.onConfirm).toHaveBeenCalledWith(false);
  });
});
