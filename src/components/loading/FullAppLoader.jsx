import { Box, CircularProgress, Typography } from '@mui/material';

const FullAppLoader = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h5">The application is loading...</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
        Wait a moment
      </Typography>
    </Box>
  );
};

export default FullAppLoader;
