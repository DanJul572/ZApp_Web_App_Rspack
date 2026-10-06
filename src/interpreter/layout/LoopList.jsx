import Box from '@mui/material/Box';

/**
 * Render `items` secara vertikal memakai fungsi `render(item, index)`.
 */
const LoopList = (props) => {
  const { items, render } = props;

  return (
    <Box
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {items.map(render)}
    </Box>
  );
};

export default LoopList;
