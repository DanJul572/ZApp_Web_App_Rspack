import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: process.env.VITE_THEME || 'light',
    primary: {
      light: '#ffec8b', // amber soft
      main: '#ffb400', // orange agak merah (utama)
      dark: '#c77800', // coklat–orange gelap
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
