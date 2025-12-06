import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
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
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Oops! The page you are looking for was not found.
      </Typography>
      <Typography sx={{ mb: 4, color: 'gray' }}>
        It seems this page is unavailable or may have been moved.
      </Typography>

      <Button variant="contained" size="large" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
