import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import { version } from '../../../package.json';
import UserOptions from './UserOptions';

const Topbar = () => {
  const { config } = useConfig();
  const { logout: logoutMutation } = useAuth();
  const { setExpandedMenu } = useExpandedMenu();
  const { userData } = useUserData();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const appName = config.app.name || 'ZApp';
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
    logoutMutation.mutate();
    setExpandedMenu([]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={(theme) => ({
            width: 36,
            height: 36,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.primary.contrastText,
            fontWeight: 800,
            fontSize: 16,
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 4px 12px ${theme.palette.primary[200]}`,
          })}
        >
          {appName.charAt(0).toUpperCase()}
        </Box>
        <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
          {appName}
        </Typography>
        <Chip
          label={`v${version}`}
          size="small"
          sx={{
            height: 20,
            fontSize: 11,
            backgroundColor: 'primary.50',
            color: 'primary.main',
          }}
        />
      </Box>
      {avatarLabel && (
        <ButtonBase
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            pl: 0.5,
            pr: 1,
            borderRadius: '999px',
            border: '1px solid',
            borderColor: open ? 'primary.main' : 'divider',
            transition: 'border-color 0.15s',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              fontSize: 14,
              bgcolor: 'primary.main',
            }}
          >
            {avatarLabel}
          </Avatar>
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 600, maxWidth: 160 }}
          >
            {userData.userName}
          </Typography>
          <KeyboardArrowDown
            fontSize="small"
            sx={{
              color: 'text.secondary',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
          />
        </ButtonBase>
      )}
      <UserOptions
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        loading={logoutMutation.isPending}
        logout={logout}
      />
    </Box>
  );
};

export default Topbar;
