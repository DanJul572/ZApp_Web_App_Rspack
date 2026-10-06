import ArrowBack from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';
import IconTile from './IconTile';

/**
 * Standard page title bar: optional back button, icon, title, subtitle and
 * right-aligned actions. With `sticky`, it stays below the top bar on scroll.
 */
const PageHeader = (props) => {
  const { icon, title, subtitle, actions, onBack, sticky = false } = props;

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        },
        sticky && {
          position: 'sticky',
          top: TOPBAR_HEIGHT,
          zIndex: 3,
          mx: -3,
          mt: -3,
          px: 3,
          py: 2,
          backgroundColor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      ]}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}
      >
        {onBack && (
          <Tooltip title="Back">
            <IconButton
              onClick={onBack}
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {icon && <IconTile size={44}>{icon}</IconTile>}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" component="h1" noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary" noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
