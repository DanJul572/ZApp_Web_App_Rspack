import { Link } from 'react-router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Password from '@/component/input/Password';
import ShortText from '@/component/input/ShortText';

import Translator from '@/hook/Translator';

import useLogin from './hooks';

import './style.css';

const Page = () => {
  const { t } = Translator();

  const { email, setEmail, password, setPassword, mutation } = useLogin();

  return (
    <Box className="container">
      <Card className="card-container">
        <Box className="form-container">
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
        >
          {t('login')}
        </Button>
        <Box className="button-container">
          <Typography>
            {t("don't_have_an_account")}
            <Link to="/register" className="register-link">
              {t('register')}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Page;
