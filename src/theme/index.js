import { alpha, createTheme, darken } from '@mui/material/styles';

const FONT_FAMILY = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const isObject = (item) =>
  item && typeof item === 'object' && !Array.isArray(item);

const deepMerge = (target, source) => {
  const output = { ...target };
  for (const key of Object.keys(source || {})) {
    output[key] =
      isObject(target[key]) && isObject(source[key])
        ? deepMerge(target[key], source[key])
        : source[key];
  }
  return output;
};

const baseOptions = (mode) => {
  const isDark = mode === 'dark';

  return {
    palette: {
      mode,
      primary: { main: '#475569' },
      background: isDark
        ? { default: '#0f1117', paper: '#171a23' }
        : { default: '#f5f6fa', paper: '#ffffff' },
      text: isDark
        ? { primary: '#e7e9f0', secondary: '#9aa0b4' }
        : { primary: '#1d2130', secondary: '#5d6377' },
      divider: isDark ? 'rgba(255,255,255,0.08)' : '#e6e8ef',
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: FONT_FAMILY,
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontSize: '1.375rem', fontWeight: 700 },
      h6: { fontSize: '1.0625rem', fontWeight: 600 },
      subtitle1: { fontSize: '0.9375rem', fontWeight: 600 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 600 },
      body1: { fontSize: '0.875rem' },
      body2: { fontSize: '0.8125rem' },
      caption: { fontSize: '0.75rem' },
      button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
      overline: {
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
      },
    },
  };
};

// Adds `50`, `100`, `200` tints to every palette color so sx values such as
// `primary.50` or `warning.200` resolve to a real color.
const addTints = (palette) => {
  for (const name of ['primary', 'secondary', 'error', 'warning', 'info']) {
    const color = palette[name];
    color[50] = alpha(color.main, 0.08);
    color[100] = alpha(color.main, 0.14);
    color[200] = alpha(color.main, 0.32);
  }
  palette.success[50] = alpha(palette.success.main, 0.08);
  palette.success[100] = alpha(palette.success.main, 0.14);
  palette.success[200] = alpha(palette.success.main, 0.32);
  palette.action[50] = palette.action.hover;
};

const componentOverrides = (theme) => {
  const { palette } = theme;
  const isDark = palette.mode === 'dark';
  const softShadow = isDark
    ? '0 1px 2px rgba(0,0,0,0.4)'
    : '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)';
  const focusRing = `0 0 0 3px ${alpha(palette.primary.main, 0.18)}`;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
          WebkitFontSmoothing: 'antialiased',
        },
        '::selection': {
          backgroundColor: alpha(palette.primary.main, 0.2),
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(palette.text.primary, 0.18),
          borderRadius: 8,
        },
        '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 12 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${palette.divider}`,
          boxShadow: softShadow,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16 },
        sizeSmall: { paddingInline: 12 },
        outlined: { borderColor: palette.divider },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${palette.primary.main} 0%, ${darken(palette.primary.main, 0.18)} 100%)`,
          '&:hover': {
            boxShadow: `0 6px 16px ${alpha(palette.primary.main, 0.32)}`,
          },
          '&.Mui-disabled': { backgroundImage: 'none' },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableElevation: true },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: palette.background.paper,
          transition: 'box-shadow 0.15s',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#dcdfe8',
          },
          '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(palette.primary.main, 0.5),
          },
          '&.Mui-focused': { boxShadow: focusRing },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: palette.primary.main,
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#2a2f3d' : '#1d2130',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '6px 10px',
        },
        arrow: { color: isDark ? '#2a2f3d' : '#1d2130' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, alignItems: 'center' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: '1.0625rem', fontWeight: 700 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${palette.divider}`,
          boxShadow: '0 12px 32px rgba(16,24,40,0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: 6, marginInline: 6, fontSize: '0.875rem' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(palette.primary.main, 0.1),
            color: palette.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, minHeight: 48 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: palette.divider },
        head: {
          fontSize: '0.75rem',
          fontWeight: 700,
          color: palette.text.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          '&:not(.MuiBackdrop-invisible)': {
            backgroundColor: alpha('#0f1117', 0.45),
            backdropFilter: 'blur(2px)',
          },
        },
      },
    },
  };
};

/**
 * Builds the application theme. `muiConfig` (from `config.json`) is merged on
 * top of the base design so a deployment can still override any value.
 */
const createAppTheme = (muiConfig = {}) => {
  const mode = muiConfig?.palette?.mode === 'dark' ? 'dark' : 'light';
  const { components: configComponents, ...configOptions } = muiConfig;

  const theme = createTheme(deepMerge(baseOptions(mode), configOptions));
  addTints(theme.palette);

  theme.components = deepMerge(
    componentOverrides(theme),
    configComponents || {},
  );

  return theme;
};

export default createAppTheme;
