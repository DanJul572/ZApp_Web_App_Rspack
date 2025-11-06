import Box from '@mui/material/Box';

import Dropdown from '@/components/input/Dropdown';

const ViewList = (props) => {
  const { viewId, setViewId, viewOptions } = props;

  return (
    <Box paddingX={2} paddingTop={2}>
      <Dropdown
        placeholder="Select View"
        value={viewId}
        options={viewOptions}
        onChange={setViewId}
      />
    </Box>
  );
};

export default ViewList;
