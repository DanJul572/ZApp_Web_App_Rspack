import CTheme from '@configs/CTheme';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FullCoverLoader from '@/components/loading/FullCoverLoader';
import Toast from '@/components/toast';

const Empty = ({ children }) => {
  const theme = createTheme(CTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullCoverLoader />
      <Toast />
      {children}
    </ThemeProvider>
  );
};

export default Empty;
