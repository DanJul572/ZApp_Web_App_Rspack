import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FullAppLoader from '@/components/loading/FullAppLoader';
import FullCoverLoader from '@/components/loading/FullCoverLoader';
import Toast from '@/components/toast';
import { useConfig } from '@/contexts/ConfigProvider';

const Empty = ({ children }) => {
  const { config, loading } = useConfig();

  if (loading || !config) {
    return <FullAppLoader />;
  }

  const theme = createTheme(config.mui);

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
