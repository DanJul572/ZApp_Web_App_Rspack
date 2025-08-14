import Box from '@mui/material/Box';

const MapLoop = (props) => {
  const { items, render } = props;

  return (
    <Box gap={1} display="flex" flexDirection="column">
      {items.map(render)}
    </Box>
  );
};

export default MapLoop;
