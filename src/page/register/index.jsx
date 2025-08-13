import { Card, createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Dropdown from '@/component/input/Dropdown';
import Password from '@/component/input/Password';
import ShortText from '@/component/input/ShortText';
import CApiUrl from '@/constant/CApiUrl';
import CFieldID from '@/constant/CFieldID';
import CTheme from '@/constant/CTheme';
import { useToast } from '@/context/ToastProvider';
import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

const Page = () => {
  const theme = createTheme(CTheme);
  const { post } = Request();
  const translator = Translator();

  const navigate = useNavigate();
  const { setToast } = useToast();

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

    return await post(CApiUrl.auth.register, body, false);
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
          variant="contained"
          onClick={mutation.mutate}
          disabled={mutation.isPending}
        >
          {translator('signin')}
        </Button>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Typography fontSize={CTheme.font.size.value}>
            Have An Account?{' '}
            <Link to="/login" style={{ color: theme.palette.primary.main }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Page;
