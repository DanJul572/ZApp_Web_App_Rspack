import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: process.env.THEME || 'light',
    primary: {
      light: '#90a4ae',
      main: '#607d8b',
      dark: '#455a64',
    },
    secondary: {
      light: '#D2E8D4',
      main: '#81C784',
      dark: '#519657',
    },
    error: {
      light: '#EF9A9A',
      main: '#F44336',
      dark: '#D32F2F',
    },
    info: {
      light: '#AEDFF7',
      main: '#4FC3F7',
      dark: '#0288D1',
    },
    success: {
      light: '#C8E6C9',
      main: '#66BB6A',
      dark: '#388E3C',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variant: 'body2',
      },
    },
  },
});

export default theme;
