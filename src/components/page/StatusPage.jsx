import ArrowBack from '@mui/icons-material/ArrowBack';
import Home from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import IconTile from './IconTile';

/**
 * Full-screen status message used by the error pages.
 */
const StatusPage = (props) => {
  const { code, icon, color = 'primary', title, description } = props;
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
        backgroundColor: 'background.default',
      }}
    >
      <IconTile size={64} color={color} sx={{ mb: 3 }}>
        {icon}
      </IconTile>
      <Typography
        component="p"
        sx={(theme) => ({
          fontSize: { xs: '4.5rem', md: '6.5rem' },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          mb: 2,
          backgroundImage: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        })}
      >
        {code}
      </Typography>
      <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 4, maxWidth: 420 }}>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default StatusPage;
