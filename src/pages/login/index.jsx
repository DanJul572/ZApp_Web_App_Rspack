import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Password from '@/components/input/Password';
import ShortText from '@/components/input/ShortText';
import AuthShell from '@/components/page/AuthShell';
import { useAuth } from '@/contexts/AuthProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import { useToast } from '@/contexts/ToastProvider';
import handleError from '@/helpers/handleError';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

const Page = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const { setExpandedMenu } = useExpandedMenu();
  const { setToast } = useToast();
  const { config } = useConfig();
  const { refetch: refreshUserData } = useAuth();

  const request = Request();
  const translator = Translator();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onLogin = async () => {
    const body = { email: email, password: password };
    return await request.post(config.api.auth.login, body);
  };

  const setLocalStorage = (data) => {
    localStorage.setItem('expiredIn', data.expiredIn);
    localStorage.setItem('expiredAt', data.expiredAt);
  };

  const mutation = useMutation({
    mutationKey: ['submit-login'],
    mutationFn: onLogin,
    onSuccess: (res) => {
      refreshUserData().then(() => {
        setExpandedMenu([]);
        setLocalStorage(res.data);
        navigate(res.data.afterLogin);
      });
    },
    onError: (err) => {
      const errorMessage = handleError(err);
      setToast({ status: true, type: 'error', message: errorMessage });
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle={`Welcome back to ${config.app.name || 'ZApp'}. Enter your credentials to continue.`}
      onBack={() => navigate(-1)}
      footer={
        <Typography variant="body2">
          {translator("don't_have_an_account")}
          <Link
            to="/register"
            style={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              marginLeft: 4,
              textDecoration: 'none',
            }}
          >
            {translator('register')}
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
            label="Email"
            name="email"
            value={email}
            onChange={setEmail}
          />
          <Password
            label="Password"
            name="password"
            value={password}
            onChange={setPassword}
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
          {translator('login')}
        </Button>
      </Box>
    </AuthShell>
  );
};

export default Page;
