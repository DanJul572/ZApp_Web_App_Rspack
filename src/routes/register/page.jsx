import { useRouter, Link } from 'react-router-dom';
import { useState } from 'react';

import { useLoading } from '@/context/LoadingProvider';
import { useToast } from '@/context/ToastProvider';
import { createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

import Dropdown from '@/component/input/Dropdown';
import Password from '@/component/input/Password';
import ShortText from '@/component/input/ShortText';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import CApiUrl from '@/constant/CApiUrl';
import CFieldID from '@/constant/CFieldID';
import CTheme from '@/constant/CTheme';

const Page = () => {
  const theme = createTheme(CTheme);
  const { post } = Request();
  const { t } = Translator();

  const { push } = useRouter();
  const { setLoading } = useLoading();
  const { setToast } = useToast();

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [roleId, setRoleId] = useState(null);

  const onSignIn = () => {
    setLoading(true);

    const body = {
      name: name,
      email: email,
      password: password,
      roleId: roleId,
    };

    post(CApiUrl.auth.register, body, false)
      .then(() => {
        setToast({ status: true, type: 'success', message: 'Success' });
        push('/login');
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
      <Box
        border={CTheme.border.size.value}
        borderColor={grey[300]}
        borderRadius={1}
        display="flex"
        flexDirection="column"
        padding={2}
        width={450}
      >
        <Box marginBottom={3} display="flex" flexDirection="column" gap={1}>
          <ShortText label="Name" value={name} onChange={setName} />
          <ShortText label="Email" value={email} onChange={setEmail} />
          <Dropdown
            label="Role"
            value={roleId}
            onChange={setRoleId}
            id={CFieldID.users.roleId}
          />
          <Box display="flex" gap={1}>
            <Password
              label="Password"
              name="password"
              value={password}
              onChange={setPassword}
            />
            <Password
              label="Repeat Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </Box>
        </Box>
        <Button variant="contained" onClick={onSignIn}>
          {t('signin')}
        </Button>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Typography fontSize={CTheme.font.size.value}>
            Have An Account ?{' '}
            <Link href="/login" style={{ color: theme.palette.primary.main }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
