import Box from '@mui/material/Box';

import Dropdown from '@/component/input/Dropdown';

const ViewList = (props) => {
  const { viewId, setViewId, viewOptions } = props;

  return (
    <Box paddingX={2} paddingTop={2}>
      <Dropdown value={viewId} options={viewOptions} onChange={setViewId} />
    </Box>
  );
};

export default ViewList;
