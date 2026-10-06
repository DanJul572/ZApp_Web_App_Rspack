import CFieldID from '@configs/CFieldID';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Dropdown from '@/components/input/Dropdown';
import Password from '@/components/input/Password';
import ShortText from '@/components/input/ShortText';
import AuthShell from '@/components/page/AuthShell';
import { useConfig } from '@/contexts/ConfigProvider';
import { useToast } from '@/contexts/ToastProvider';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

const Page = () => {
  const theme = useTheme();
  const request = Request();
  const translator = Translator();

  const navigate = useNavigate();

  const { setToast } = useToast();
  const { config } = useConfig();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSignIn = async () => {
    const body = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      roleId: formData.roleId,
    };

    return await request.post(config.api.auth.register, body);
  };

  const mutation = useMutation({
    mutationFn: onSignIn,
    onSuccess: () => {
      setToast({ status: true, type: 'success', message: 'Success' });
      navigate('/login');
    },
    onError: (err) => {
      setToast({ status: true, type: 'error', message: err });
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Fill in your details to get started."
      onBack={() => navigate(-1)}
      footer={
        <Typography variant="body2">
          Have an account?
          <Link
            to="/login"
            style={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              marginLeft: 4,
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ShortText
            label="Name"
            value={formData.name}
            onChange={(val) => updateField('name', val)}
          />
          <ShortText
            label="Email"
            value={formData.email}
            onChange={(val) => updateField('email', val)}
          />
          <Dropdown
            label="Role"
            value={formData.roleId}
            onChange={(val) => updateField('roleId', val)}
            id={CFieldID.users.roleId}
          />
          <Password
            label="Password"
            name="password"
            value={formData.password}
            onChange={(val) => updateField('password', val)}
          />
          <Password
            label="Repeat Password"
            value={formData.confirmPassword}
            onChange={(val) => updateField('confirmPassword', val)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {translator('signin')}
        </Button>
      </Box>
    </AuthShell>
  );
};

export default Page;
