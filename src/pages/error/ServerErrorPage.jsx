import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '8rem' } }}>
        500
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Internal Server Error
      </Typography>
      <Typography sx={{ mb: 4, color: 'gray', maxWidth: 400 }}>
        Something went wrong on our server. We are working to fix it. Please try
        again later.
      </Typography>

      <Button variant="contained" size="large" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
};

export default ServerErrorPage;
