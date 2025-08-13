import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import CTheme from '@/constant/CTheme';
import { useExpandedMenu } from '@/context/ExpandedMenuProvider';
import auth from '@/helper/auth';

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
