import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const isEmpty = (value) =>
  value === null || value === undefined || value === '';

/**
 * Read-only label/value grid for detail pages. Empty values show a dash;
 * items with `fullWidth` span the whole row.
 */
const DetailList = (props) => {
  const { items = [] } = props;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 2.5,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={[{ minWidth: 0 }, item.fullWidth && { gridColumn: '1 / -1' }]}
        >
          <Typography variant="caption" color="textSecondary">
            {item.label}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{ wordBreak: 'break-word' }}
          >
            {isEmpty(item.value) ? '—' : item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DetailList;
