import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';
import { useLoading } from '@/context/LoadingProvider';
import { useToast } from '@/context/ToastProvider';

import { createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Password from '@/component/input/Password';
import ShortText from '@/component/input/ShortText';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';

const Page = () => {
  const theme = createTheme(CTheme);

  const navigate = useNavigate();
  const { post } = Request();
  const { t } = Translator();

  const { setExpandedMenu } = useExpandedMenu();
  const { setLoading } = useLoading();
  const { setToast } = useToast();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onLogin = () => {
    setLoading(true);

    const body = { email: email, password: password };

    post(CApiUrl.auth.login, body, false)
      .then((res) => {
        localStorage.setItem('token', res.accessToken);
        setExpandedMenu([]);
        navigate(res.afterLogin);
      })
      .catch((err) => {
        setToast({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

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
          onClick={onLogin}
          size={CTheme.button.size.name}
        >
          {t('login')}
        </Button>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Typography fontSize={CTheme.font.size.value}>
            {t("don't_have_an_account")}
            <Link
              href="/register"
              style={{ color: theme.palette.primary.main, marginLeft: 3 }}
            >
              {t('register')}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Page;
