import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import ShortText from '@/components/input/ShortText';
import { PropertySection } from '../common/PropertyUI';
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
    <Box sx={{ py: 2 }}>
      <PropertySection title="Page">
        <Box sx={{ px: 1, pb: 1 }}>
          <ShortText
            value={localLabel}
            label="Label"
            onChange={setLocalLabel}
          />
        </Box>
        <OnLoad page={page} setPage={setPage} />
      </PropertySection>
    </Box>
  );
};

export default PageSettings;
