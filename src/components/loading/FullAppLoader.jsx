import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const FullAppLoader = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        backgroundColor: '#f5f6fa',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <CircularProgress size={36} thickness={4} sx={{ mb: 2 }} />
      <Typography sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
        The application is loading...
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontFamily: 'inherit', color: 'text.secondary' }}
      >
        Wait a moment
      </Typography>
    </Box>
  );
};

export default FullAppLoader;
