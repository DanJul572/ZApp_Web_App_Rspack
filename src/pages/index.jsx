import Login from '@mui/icons-material/Login';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import AuthShell from '@/components/page/AuthShell';
import { useConfig } from '@/contexts/ConfigProvider';

export default function Page() {
  const navigate = useNavigate();
  const { config } = useConfig();

  return (
    <AuthShell
      title={`Welcome to ${config.app.name || 'ZApp'}`}
      subtitle="Sign in to continue, or create a new account to get started."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Login />}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<PersonAddAlt />}
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Box>
    </AuthShell>
  );
}
