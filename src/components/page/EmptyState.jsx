import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconTile from './IconTile';

const EmptyState = (props) => {
  const { icon, title, description, action, sx } = props;

  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1,
          py: 6,
          px: 3,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {icon && (
        <IconTile size={56} sx={{ mb: 1 }}>
          {icon}
        </IconTile>
      )}
      <Typography variant="subtitle1">{title}</Typography>
      {description && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ maxWidth: 380 }}
        >
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
