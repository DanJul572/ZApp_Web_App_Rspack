const theme = {
  palette: {
    mode: process.env.THEME || 'light',
    primary: {
      light: '#D32F2F',
      main: '#B00020',
      dark: '#7F0014',
    },
    secondary: {
      light: '#D1A3A4',
      main: '#9E4D4F',
      dark: '#5E1F21',
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#B71C1C',
    },
    info: {
      light: '#7986CB',
      main: '#3F51B5',
      dark: '#303F9F',
    },
    success: {
      light: '#81C784',
      main: '#43A047',
      dark: '#2E7D32',
    },
  },
  font: {
    size: {
      value: 12,
      name: 'small',
    },
  },
  button: {
    size: {
      name: 'small',
    },
  },
  field: {
    size: {
      name: 'small',
    },
  },
  border: {
    size: {
      value: 1,
    },
  },
};

export default theme;
