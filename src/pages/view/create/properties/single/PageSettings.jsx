import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import ShortText from '@/components/input/ShortText';
import OnLoad from './OnLoad';

const PageSettings = (props) => {
  const { label, setLabel, page, setPage } = props;

  const [localLabel, setLocalLabel] = useState(label);

  useEffect(() => {
    setLocalLabel(label);
  }, [label]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setLabel(localLabel);
    }, 1000);

    return () => clearTimeout(handler);
  }, [localLabel, setLabel]);

  return (
    <Box padding={2} display="flex" flexDirection="column" gap={2}>
      <ShortText value={localLabel} label="Label" onChange={setLocalLabel} />
      <OnLoad page={page} setPage={setPage} />
    </Box>
  );
};

export default PageSettings;
