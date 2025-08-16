import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';

export default function Page() {
  const navigate = useNavigate();

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
              Hello World!
            </Typography>

            <ButtonGroup variant="text" aria-label="login register actions">
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
