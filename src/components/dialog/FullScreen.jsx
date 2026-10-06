import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const FullScreen = (props) => {
  const { open, setOpen, children, title = 'Preview' } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      aria-hidden={open ? 'false' : 'true'}
      slotProps={{
        paper: { sx: { backgroundColor: 'background.default' } },
      }}
    >
      <AppBar
        color="inherit"
        elevation={0}
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={handleClose}
            aria-label="close"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Dialog>
  );
};

export default FullScreen;
