import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ContentLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '70vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default ContentLoader;
