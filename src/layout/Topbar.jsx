import { useNavigate } from 'react-router';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Logout from '@mui/icons-material/Logout';

import auth from '@/helper/auth';
import CTheme from '@/constant/CTheme';

const Topbar = () => {
  const navigate = useNavigate();
  const { setExpandedMenu } = useExpandedMenu();

  const logout = () => {
    auth.logout();
    setExpandedMenu([]);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        backgroundColor: CTheme.palette.primary.main,
      }}
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
