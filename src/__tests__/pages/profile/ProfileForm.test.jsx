import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileForm from '@/pages/profile/components/ProfileForm';

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockRefetch = jest.fn();
const mockToaster = {
  showErrorToast: jest.fn(),
  showSuccessToast: jest.fn(),
};

jest.mock('@/hooks/Request', () => () => ({ get: mockGet, post: mockPost }));
jest.mock('@/hooks/Toaster', () => () => mockToaster);
jest.mock('@/hooks/ProfilePicture', () => ({
  __esModule: true,
  default: () => null,
  profilePictureQueryKey: ['profile-picture'],
  readAsDataUrl: async () => 'data:image/png;base64,AAAA',
}));
jest.mock('@/contexts/AuthProvider', () => ({
  useAuth: () => ({ refetch: mockRefetch }),
}));
jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => ({
    config: {
      api: { profile: { detail: '/profile', update: '/profile/update' } },
    },
  }),
}));
jest.mock('@/contexts/UserDataProvider', () => ({
  useUserData: () => ({ userData: { userId: 1, userName: 'Dev' } }),
}));

const profile = { id: 1, name: 'Dev', email: 'dev@zapp.com', picture: null };

const renderForm = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProfileForm />
    </QueryClientProvider>,
  );

const pickFile = (file) =>
  fireEvent.change(screen.getByTestId('picture-input'), {
    target: { files: [file] },
  });

describe('ProfileForm', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: profile });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fills the form and enables saving only after a change', async () => {
    renderForm();

    expect(await screen.findByDisplayValue('dev@zapp.com')).toBeInTheDocument();
    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).toBeDisabled();

    fireEvent.change(screen.getByDisplayValue('Dev'), {
      target: { value: 'Dev Ops' },
    });
    expect(save).toBeEnabled();
  });

  it('refuses a picture that is not a JPG, PNG or WEBP image', async () => {
    renderForm();
    await screen.findByDisplayValue('dev@zapp.com');

    pickFile(new File(['<svg/>'], 'me.svg', { type: 'image/svg+xml' }));

    expect(mockToaster.showErrorToast).toHaveBeenCalledWith(
      'Profile picture must be a JPG, PNG or WEBP image',
    );
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('refuses a picture larger than 2 MB', async () => {
    renderForm();
    await screen.findByDisplayValue('dev@zapp.com');

    const file = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 + 1 });
    pickFile(file);

    expect(mockToaster.showErrorToast).toHaveBeenCalledWith(
      'Profile picture is too large (max 2MB)',
    );
  });

  it('sends the name, email and picked picture together', async () => {
    mockPost.mockResolvedValue({
      message: 'Profile was updated successfully',
      data: { ...profile, name: 'Dev Ops' },
    });
    renderForm();
    await screen.findByDisplayValue('dev@zapp.com');

    const file = new File(['png'], 'me.png', { type: 'image/png' });
    pickFile(file);
    fireEvent.change(screen.getByDisplayValue('Dev'), {
      target: { value: 'Dev Ops' },
    });
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Save changes' }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(mockToaster.showSuccessToast).toHaveBeenCalledWith(
        'Profile was updated successfully',
      ),
    );
    expect(mockPost).toHaveBeenCalledWith(
      '/profile/update',
      { name: 'Dev Ops', email: 'dev@zapp.com', removePicture: false },
      [{ file, id: 'me.png' }],
      false,
    );
    expect(mockRefetch).toHaveBeenCalled();
  });
});
