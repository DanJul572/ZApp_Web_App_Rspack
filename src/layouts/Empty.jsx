import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FullCoverLoader from '@/components/loading/FullCoverLoader';
import Toast from '@/components/toast';
import { useConfig } from '@/contexts/ConfigProvider';

const Empty = ({ children }) => {
  const { config, loading, error } = useConfig();

  if (loading || !config) return <div>Loading...</div>;
  if (error) return <div>Error loading config</div>;

  const theme = createTheme(config.ui);

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
