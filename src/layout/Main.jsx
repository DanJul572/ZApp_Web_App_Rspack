import Alert from '@/component/alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Toolbar from '@mui/material/Toolbar';

import { ThemeProvider, createTheme } from '@mui/material';

import FullCoverLoader from '@/component/loading/FullCoverLoader';
import Toast from '@/component/toast';

import CTheme from '@/constant/CTheme';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Main({ children }) {
  const theme = createTheme(CTheme);

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
