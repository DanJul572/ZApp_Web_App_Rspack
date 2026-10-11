import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PasswordForm from '@/pages/profile/components/PasswordForm';

const mockPost = jest.fn();
const mockToaster = {
  showErrorToast: jest.fn(),
  showSuccessToast: jest.fn(),
};

jest.mock('@/hooks/Request', () => () => ({ post: mockPost }));
jest.mock('@/hooks/Toaster', () => () => mockToaster);
jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => ({
    config: {
      api: { profile: { changePassword: '/profile/change-password' } },
    },
  }),
}));
jest.mock('@/contexts/UserDataProvider', () => ({
  useUserData: () => ({ userData: { userId: 1, email: 'dev@zapp.com' } }),
}));

const renderForm = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PasswordForm />
    </QueryClientProvider>,
  );

const fill = (name, value) =>
  fireEvent.change(document.querySelector(`input[name="${name}"]`), {
    target: { value },
  });

describe('PasswordForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the button disabled until the form is complete and valid', () => {
    renderForm();
    const button = screen.getByRole('button', { name: 'Change password' });

    expect(button).toBeDisabled();

    fill('currentPassword', 'old-pass');
    fill('newPassword', 'short');
    fill('confirmPassword', 'short');
    expect(button).toBeDisabled();

    fill('newPassword', 'new-pass-1');
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(button).toBeDisabled();

    fill('confirmPassword', 'new-pass-1');
    expect(
      screen.queryByText('Passwords do not match'),
    ).not.toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('sends the current and new password and clears the form on success', async () => {
    mockPost.mockResolvedValue({
      message: 'Password was changed successfully',
    });
    renderForm();

    fill('currentPassword', 'old-pass');
    fill('newPassword', 'new-pass-1');
    fill('confirmPassword', 'new-pass-1');
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }));

    await waitFor(() =>
      expect(mockToaster.showSuccessToast).toHaveBeenCalledWith(
        'Password was changed successfully',
      ),
    );
    expect(mockPost).toHaveBeenCalledWith('/profile/change-password', {
      currentPassword: 'old-pass',
      newPassword: 'new-pass-1',
      confirmPassword: 'new-pass-1',
    });
    expect(document.querySelector('input[name="currentPassword"]')).toHaveValue(
      '',
    );
  });

  it('shows the API message when the current password is wrong', async () => {
    mockPost.mockRejectedValue({ message: 'Current password is incorrect' });
    renderForm();

    fill('currentPassword', 'wrong-pass');
    fill('newPassword', 'new-pass-1');
    fill('confirmPassword', 'new-pass-1');
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }));

    await waitFor(() =>
      expect(mockToaster.showErrorToast).toHaveBeenCalledWith(
        'Current password is incorrect',
      ),
    );
    expect(document.querySelector('input[name="currentPassword"]')).toHaveValue(
      'wrong-pass',
    );
  });
});
