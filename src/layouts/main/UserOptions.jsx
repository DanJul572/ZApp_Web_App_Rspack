import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Timer from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useNavigate } from 'react-router';
import UserAvatar from '@/components/page/UserAvatar';
import { useUserData } from '@/contexts/UserDataProvider';
import CountdownSession from '@/hooks/CountdownSession';

const UserOptions = (props) => {
  const { open, onClose, anchorEl, loading, logout } = props;

  const timeLeft = CountdownSession();

  const { userData } = useUserData();

  const navigate = useNavigate();

  const id = useId();

  return (
    <Menu
      anchorEl={anchorEl}
      id={id}
      open={open}
      onClose={onClose}
      onClick={onClose}
      slotProps={{
        paper: {
          sx: { mt: 1, minWidth: 240 },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box
        sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
      >
        <UserAvatar size={40} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {userData?.userName}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
            }}
          >
            <Timer sx={{ fontSize: 14 }} />
            <Typography variant="caption">Session {timeLeft}</Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 0.5 }} />

      <MenuItem
        onClick={() => {
          navigate('/profile');
        }}
      >
        <ListItemIcon>
          <AccountCircleOutlined fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/setting');
        }}
      >
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem
        onClick={logout}
        disabled={loading}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserOptions;
