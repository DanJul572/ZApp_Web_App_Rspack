import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useConfig } from '@/contexts/ConfigProvider';

const HIGHLIGHTS = [
  'Design modules, fields and views without code',
  'Build menus and role-based navigation',
  'Compose email templates with live data',
];

const BrandMark = ({ name, inverted = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box
      sx={(theme) => ({
        width: 40,
        height: 40,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 18,
        color: inverted ? theme.palette.primary.main : '#fff',
        backgroundColor: inverted ? '#fff' : theme.palette.primary.main,
      })}
    >
      {name.charAt(0).toUpperCase()}
    </Box>
    <Typography
      variant="h6"
      sx={{ fontWeight: 800, color: inverted ? '#fff' : 'text.primary' }}
    >
      {name}
    </Typography>
  </Box>
);

/**
 * Two-column layout for the public pages: a branded panel on the left and the
 * form card on the right. The brand panel is hidden on small screens.
 */
const AuthShell = (props) => {
  const { title, subtitle, children, footer, onBack } = props;
  const { config } = useConfig();

  const appName = config?.app?.name || 'ZApp';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' },
        backgroundColor: 'background.default',
      }}
    >
      <Box
        sx={(theme) => ({
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(150deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
          },
          '&::before': { width: 420, height: 420, top: -140, right: -160 },
          '&::after': { width: 300, height: 300, bottom: -120, left: -100 },
        })}
      >
        <BrandMark name={appName} inverted />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 420 }}>
          <Typography
            variant="h4"
            sx={{ color: '#fff', mb: 1.5, lineHeight: 1.25 }}
          >
            Build business apps faster.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Everything you need to model data and ship internal tools in one
            place.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {HIGHLIGHTS.map((text) => (
              <Box
                key={text}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                <CheckCircle sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.92)' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          © {new Date().getFullYear()} {appName}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
            <BrandMark name={appName} />
          </Box>
          {onBack && (
            <Button
              startIcon={<ArrowBack />}
              onClick={onBack}
              size="small"
              color="inherit"
              sx={{ mb: 2, color: 'text.secondary', ml: -1 }}
            >
              Back
            </Button>
          )}
          <Card sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>{children}</Box>
          </Card>
          {footer && (
            <Box
              sx={{
                mt: 3,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              {footer}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthShell;
