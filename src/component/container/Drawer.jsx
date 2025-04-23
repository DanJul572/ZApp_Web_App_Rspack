import Box from '@mui/material/Box';

import MuiDrawer from '@/alias/MuiDrawer';

const Drawer = (props) => {
  const { anchor, open, children, setOpen, size } = props;

  const onOpen = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  const drawerSize = {};
  if (anchor && (anchor === 'top' || anchor === 'bottom')) {
    drawerSize.height = Number.parseInt(size) || 750;
  } else {
    drawerSize.width = Number.parseInt(size) || 750;
  }

  return (
    <MuiDrawer
      open={open}
      onClose={onOpen}
      anchor={anchor || 'right'}
      sx={{ zIndex: 9998 }}
    >
      <Box padding={2} {...drawerSize}>
        {children}
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;
