import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import { useState } from 'react';

import isValidProperties from '@/helpers/isValidProperties';
import CodeDialog from '../code/CodeDialog';
import getCodeSpec from '../code/codeSpecs';
import { PropertyRow, ValuePreview } from './PropertyUI';

const CodeForm = (props) => {
  const { content, selected, editComponent, setContent, label, name } = props;

  const type = selected ? selected.type.value : false;
  const group = selected ? selected.group.value : false;

  const [open, setOpen] = useState(false);

  const onApply = (value) => {
    const newContent = editComponent(name, value, content);

    setContent([...newContent]);
    setOpen(false);
  };

  return (
    isValidProperties(name, group, type) && (
      <Box>
        <PropertyRow label={label} onClick={() => setOpen(true)}>
          <ValuePreview value={selected.properties[name]} mono />
          <DataObject />
        </PropertyRow>
        <CodeDialog
          open={open}
          onClose={() => setOpen(false)}
          title={label}
          value={selected.properties[name]}
          spec={getCodeSpec(name, { group, type })}
          onApply={onApply}
        />
      </Box>
    )
  );
};

export default CodeForm;
