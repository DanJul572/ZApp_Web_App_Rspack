import CTheme from '@configs/CTheme';
import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import auth from '@/helpers/auth';

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
        {process.env.APP_NAME || 'Hello World!'}
      </Typography>
      <IconButton onClick={logout} color="inherit">
        <Logout />
      </IconButton>
    </Box>
  );
};

export default Topbar;
