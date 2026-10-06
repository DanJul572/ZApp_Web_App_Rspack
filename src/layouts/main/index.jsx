import { ThemeProvider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@/components/alert';
import FullAppLoader from '@/components/loading/FullAppLoader';
import FullCoverLoader from '@/components/loading/FullCoverLoader';
import Toast from '@/components/toast';
import { useConfig } from '@/contexts/ConfigProvider';
import createAppTheme from '@/theme';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from './constants';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Main({ children }) {
  const { config, loading } = useConfig();

  if (loading || !config) {
    return <FullAppLoader />;
  }

  const theme = createAppTheme(config.mui);

  return (
    <ThemeProvider theme={theme}>
      <FullCoverLoader />
      <Toast />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            height: TOPBAR_HEIGHT,
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Topbar />
        </AppBar>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            ml: `${SIDEBAR_WIDTH}px`,
            pt: `${TOPBAR_HEIGHT}px`,
            backgroundColor: 'background.default',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Alert />
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
