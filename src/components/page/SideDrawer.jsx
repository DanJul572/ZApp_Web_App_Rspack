import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

/**
 * Right-side form drawer with a fixed header and footer, following the email
 * builder drawers.
 */
const SideDrawer = (props) => {
  const {
    open,
    onClose,
    title,
    subtitle,
    actions,
    children,
    width = 520,
  } = props;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: width },
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {children}
      </Box>

      {actions && (
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {actions}
        </Box>
      )}
    </Drawer>
  );
};

export default SideDrawer;
