import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ContentLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '60vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={32} thickness={4} />
    </Box>
  );
};

export default ContentLoader;
