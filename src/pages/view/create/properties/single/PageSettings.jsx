import Box from '@mui/material/Box';

import ShortText from '@/componentss/input/ShortText';
import OnLoad from './OnLoad';

const PageSettings = (props) => {
  const { label, setLabel, page, setPage } = props;

  return (
    <Box padding={2} display="flex" flexDirection="column" gap={2}>
      <ShortText value={label} label="Label" onChange={setLabel} />
      <OnLoad page={page} setPage={setPage} />
    </Box>
  );
};

export default PageSettings;
