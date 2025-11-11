import { createTheme, ThemeProvider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useContext } from 'react';
import Alert from '@/components/alert';
import FullCoverLoader from '@/components/loading/FullCoverLoader';
import Toast from '@/components/toast';
import { ConfigContext } from '@/contexts/ConfigProvider';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Main({ children }) {
  const { config, loading, error } = useContext(ConfigContext);

  if (loading || !config) return <div>Loading...</div>;
  if (error) return <div>Error loading config</div>;

  const theme = createTheme(config.ui);

  return (
    <ThemeProvider theme={theme}>
      <FullCoverLoader />
      <Toast />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Topbar />
        </AppBar>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: 37,
          }}
        >
          <Toolbar />
          <Alert />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
