import { fireEvent, render, screen } from '@testing-library/react';
import Alert from '@/components/alert';
import { useAlert } from '@/contexts/AlertProvider';

// Mock Translator hook
jest.mock('@/hooks/Translator', () => () => (key) => key);

// Mock useAlert context
jest.mock('@/contexts/AlertProvider', () => ({
  useAlert: jest.fn(),
}));

describe('Alert Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders alert with message (positive case)', () => {
    useAlert.mockReturnValue({
      alert: { status: true, type: 'success', message: 'Test Message' },
      setAlert: jest.fn(),
    });

    render(<Alert />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders alert with default message if message is missing', () => {
    useAlert.mockReturnValue({
      alert: { status: true, type: 'success' },
      setAlert: jest.fn(),
    });

    render(<Alert />);
    expect(screen.getByText('success_message')).toBeInTheDocument();
  });

  it('does not render alert when alert is falsy (negative case)', () => {
    useAlert.mockReturnValue({
      alert: null,
      setAlert: jest.fn(),
    });

    const { container } = render(<Alert />);
    expect(container.firstChild).toBeFalsy();
  });

  it('does not render alert when alert.status is falsy (negative case)', () => {
    useAlert.mockReturnValue({
      alert: { status: false },
      setAlert: jest.fn(),
    });

    const { container } = render(<Alert />);
    expect(container.firstChild).toBeFalsy();
  });

  it('calls setAlert(false) when close button is clicked', () => {
    const setAlertMock = jest.fn();
    useAlert.mockReturnValue({
      alert: { status: true, type: 'success', message: 'Test Message' },
      setAlert: setAlertMock,
    });

    render(<Alert />);
    fireEvent.click(screen.getByRole('button'));
    expect(setAlertMock).toHaveBeenCalledWith(false);
  });
});
