import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import { useState } from 'react';
import CodeDialog from '../code/CodeDialog';
import getCodeSpec from '../code/codeSpecs';
import { PropertyRow, ValuePreview } from '../common/PropertyUI';

const OnLoad = (props) => {
  const { page, setPage } = props;

  const [open, setOpen] = useState(false);

  const onApply = (onLoad) => {
    const newPage = page ? { ...page } : {};
    newPage.onLoad = onLoad;
    setPage(newPage);
    setOpen(false);
  };

  return (
    <Box>
      <PropertyRow label="On Load" onClick={() => setOpen(true)}>
        <ValuePreview value={page?.onLoad} mono />
        <DataObject />
      </PropertyRow>
      <CodeDialog
        open={open}
        onClose={() => setOpen(false)}
        title="On Load"
        value={page?.onLoad}
        spec={getCodeSpec('onLoad')}
        onApply={onApply}
      />
    </Box>
  );
};

export default OnLoad;
