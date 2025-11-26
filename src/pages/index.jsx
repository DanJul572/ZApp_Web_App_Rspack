import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';

export default function Page() {
  const navigate = useNavigate();
  const { config } = useConfig();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card elevation={6} sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" component="h1" fontWeight={700}>
              {config.app.name || 'ZApp'}
            </Typography>
            <ButtonGroup
              variant="text"
              aria-label="login register actions"
              fullWidth
            >
              <Button sx={{ flex: 1 }} onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button sx={{ flex: 1 }} onClick={() => navigate('/register')}>
                Register
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
