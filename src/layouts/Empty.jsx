import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import FullCoverLoader from '@/componentss/loading/FullCoverLoader';
import Toast from '@/componentss/toast';

import CTheme from '@/constantss/CTheme';

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
