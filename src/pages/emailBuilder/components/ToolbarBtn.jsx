import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const ToolbarBtn = ({ icon, label, badge, active, onClick, tooltip }) => (
  <Tooltip title={tooltip || label} placement="bottom">
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.3,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'divider',
        backgroundColor: active ? 'primary.50' : 'transparent',
        transition: 'all 0.15s',
        position: 'relative',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'primary.50',
        },
        minWidth: 72,
      }}
    >
      <Box sx={{ color: active ? 'primary.main' : 'text.secondary' }}>
        {icon}
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: 10,
          color: active ? 'primary.main' : 'text.secondary',
          fontWeight: active ? 600 : 400,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
      {badge !== undefined && badge > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: 9, color: 'white', fontWeight: 700 }}>
            {badge}
          </Typography>
        </Box>
      )}
    </Box>
  </Tooltip>
);

export default ToolbarBtn;
