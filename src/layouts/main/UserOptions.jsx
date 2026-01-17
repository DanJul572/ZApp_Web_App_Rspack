import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useNavigate } from 'react-router';
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
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 12,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={onClose}>
        <Avatar />
        <Box>
          <Typography variant="subtitle1">{userData?.userName}</Typography>
          <Typography variant="caption">{timeLeft}</Typography>
        </Box>
      </MenuItem>
      <Divider />

      <MenuItem
        onClick={() => {
          navigate('/setting');
        }}
      >
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <Typography variant="subtitle2">Settings</Typography>
      </MenuItem>
      <MenuItem onClick={logout} disabled={loading}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <Typography variant="subtitle2">Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default UserOptions;
