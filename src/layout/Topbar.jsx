import { useNavigate } from 'react-router';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';
import { useLoading } from '@/context/LoadingProvider';
import { useToast } from '@/context/ToastProvider';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Logout from '@mui/icons-material/Logout';

import Request from '@/hook/Request';

import auth from '@/helper/auth';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';

const Topbar = () => {
  const { post } = Request();

  const navigate = useNavigate();
  const { setToast } = useToast();
  const { setLoading } = useLoading();
  const { setExpandedMenu } = useExpandedMenu();

  const logout = () => {
    setLoading(true);

    post(CApiUrl.auth.logout)
      .then(() => {
        auth.logout();
        setExpandedMenu([]);
        navigate('/login');
      })
      .catch((err) => {
        setToast({
          status: true,
          message: err,
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding={2}
    >
      <Typography variant="h6" noWrap component="div" color="inherit">
        ZApp
      </Typography>
      <IconButton
        size={CTheme.button.size.name}
        onClick={logout}
        color="inherit"
      >
        <Logout fontSize={CTheme.font.size.name} />
      </IconButton>
    </Box>
  );
};

export default Topbar;
