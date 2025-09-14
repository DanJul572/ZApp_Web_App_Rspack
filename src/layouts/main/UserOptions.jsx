import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useId } from 'react';
import { useNavigate } from 'react-router';

const UserOptions = (props) => {
  const { open, onClose, anchorEl, logout } = props;

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
              right: 23,
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
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={onClose}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <PersonAdd fontSize="small" />
        </ListItemIcon>
        Add another account
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
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserOptions;
