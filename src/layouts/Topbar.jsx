import CTheme from '@configs/CTheme';
import Logout from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import auth from '@/helpers/auth';
import { version } from '../../package.json';

const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}
        >
          {process.env.APP_NAME || 'ZApp'}
        </Typography>
        <Typography
          riant="subtitle2"
          component="span"
          sx={{ fontWeight: 500, color: theme.palette.primary.contrastText }}
        >
          {`v${version}`}
        </Typography>
      </Box>
      <IconButton
        onClick={logout}
        sx={{
          bgcolor: 'primary.main',
          color: theme.palette.primary.contrastText,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <Logout />
      </IconButton>
    </Box>
  );
};

export default Topbar;
