import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import Loading from '@/component/loading';
import Toast from '@/component/toast';

import CTheme from '@/constant/CTheme';

const Empty = ({ children }) => {
  const theme = createTheme(CTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Loading />
      <Toast />
      {children}
    </ThemeProvider>
  );
};

export default Empty;
