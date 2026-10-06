import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconTile from './IconTile';

/**
 * Card with a titled header strip, matching the section layout of the email
 * builder. Use `disablePadding` when the body brings its own spacing (tables).
 */
const SectionCard = (props) => {
  const {
    icon,
    title,
    subtitle,
    actions,
    children,
    disablePadding = false,
    sx,
  } = props;

  const hasHeader = icon || title || actions;

  return (
    <Card sx={[{ mb: 3 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {hasHeader && (
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon && <IconTile size={34}>{icon}</IconTile>}
            <Box>
              <Typography variant="subtitle1">{title}</Typography>
              {subtitle && (
                <Typography variant="caption" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {actions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      <Box sx={disablePadding ? undefined : { p: 3 }}>{children}</Box>
    </Card>
  );
};

export default SectionCard;
