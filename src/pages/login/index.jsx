import { createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Password from '@/components/input/Password';
import ShortText from '@/components/input/ShortText';
import CApiUrl from '@/constants/CApiUrl';
import CTheme from '@/constants/CTheme';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import { useToast } from '@/contexts/ToastProvider';
import handleError from '@/helpers/handleError';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

const Page = () => {
  const theme = createTheme(CTheme);

  const navigate = useNavigate();
  const request = Request();
  const translator = Translator();

  const { setExpandedMenu } = useExpandedMenu();
  const { setToast } = useToast();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onLogin = async () => {
    const body = { email: email, password: password };
    return await request.post(CApiUrl.auth.login, body, false);
  };

  const mutation = useMutation({
    mutationKey: ['submit-login'],
    mutationFn: onLogin,
    onSuccess: (res) => {
      localStorage.setItem('token', res.accessToken);
      setExpandedMenu([]);
      navigate(res.afterLogin);
    },
    onError: (err) => {
      const errorMessage = handleError(err);
      setToast({ status: true, type: 'error', message: errorMessage });
    },
  });

  return (
    <Box
      alignItems="center"
      bottom={0}
      display="flex"
      justifyContent="center"
      left={0}
      position="absolute"
      right={0}
      top={0}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          width: 450,
        }}
      >
        <Box marginBottom={3} display="flex" flexDirection="column" gap={1}>
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
          variant="contained"
          onClick={mutation.mutate}
          loading={mutation.isPending}
          size={CTheme.button.size.name}
        >
          {translator('login')}
        </Button>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Typography fontSize={CTheme.font.size.value}>
            {translator("don't_have_an_account")}
            <Link
              to="/register"
              style={{ color: theme.palette.primary.main, marginLeft: 3 }}
            >
              {translator('register')}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Page;
