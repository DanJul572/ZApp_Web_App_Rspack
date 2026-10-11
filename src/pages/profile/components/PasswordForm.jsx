import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Password from '@/components/input/Password';
import SectionCard from '@/components/page/SectionCard';
import { useConfig } from '@/contexts/ConfigProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from '@/pages/email/getErrorMessage';

// Same rule as the API (config/profile.js).
export const PASSWORD_MIN_LENGTH = 8;

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordForm = () => {
  const request = Request();
  const toaster = Toaster();

  const { config } = useConfig();
  const { userData } = useUserData();

  const [form, setForm] = useState(emptyForm);

  const updateField = (field) => (value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const isTooShort =
    !!form.newPassword && form.newPassword.length < PASSWORD_MIN_LENGTH;
  const isMismatch =
    !!form.confirmPassword && form.confirmPassword !== form.newPassword;
  const canSubmit =
    !!form.currentPassword &&
    !!form.newPassword &&
    !!form.confirmPassword &&
    !isTooShort &&
    !isMismatch;

  const mutation = useMutation({
    mutationKey: ['profile-change-password'],
    mutationFn: () => request.post(config.api.profile.changePassword, form),
    onSuccess: (res) => {
      toaster.showSuccessToast(res.message);
      setForm(emptyForm);
    },
    onError: (err) => {
      toaster.showErrorToast(
        getErrorMessage(err, 'Failed to change the password'),
      );
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    if (canSubmit) mutation.mutate();
  };

  return (
    <SectionCard
      icon={<LockOutlined />}
      title="Change Password"
      subtitle="Enter your current password to set a new one"
      sx={{ mb: 0 }}
    >
      <Box component="form" onSubmit={onSubmit} noValidate>
        {/* Tells password managers which account the new password belongs to. */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={userData?.email || ''}
          readOnly
          hidden
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Password
            label="Current password"
            name="currentPassword"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={updateField('currentPassword')}
            disabled={mutation.isPending}
          />
          <Password
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={updateField('newPassword')}
            disabled={mutation.isPending}
            error={isTooShort}
            helperText={`At least ${PASSWORD_MIN_LENGTH} characters`}
          />
          <Password
            label="Confirm new password"
            name="confirmPassword"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={updateField('confirmPassword')}
            disabled={mutation.isPending}
            error={isMismatch}
            helperText={isMismatch ? 'Passwords do not match' : null}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            loading={mutation.isPending}
            disabled={!canSubmit || mutation.isPending}
          >
            Change password
          </Button>
        </Box>
      </Box>
    </SectionCard>
  );
};

export default PasswordForm;
