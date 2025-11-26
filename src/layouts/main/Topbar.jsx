import { Avatar, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import auth from '@/helpers/auth';
import getUserData from '@/helpers/getUserData';
import UserOptions from './UserOptions';

const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setExpandedMenu } = useExpandedMenu();
  const { config } = useConfig();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const userData = getUserData();
  const avatarLabel = userData?.userName
    ? userData.userName.trim().charAt(0).toUpperCase()
    : null;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    auth.logout();
    setExpandedMenu([]);
    navigate('/login', {
      replace: true,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 1,
          backgroundColor: theme.palette.primary.main,
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
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.contrastText,
            }}
          >
            {config.app.name || 'ZApp'}
          </Typography>
        </Box>
        {avatarLabel && (
          <IconButton onClick={handleClick} size="small">
            <Avatar>{avatarLabel}</Avatar>
          </IconButton>
        )}
      </Box>
      <UserOptions
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        logout={logout}
      />
    </Box>
  );
};

export default Topbar;
