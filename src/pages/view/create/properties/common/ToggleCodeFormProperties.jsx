import InsertLink from '@mui/icons-material/InsertLink';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import isValidProperties from '@/helpers/isValidProperties';
import CodeDialog from '../code/CodeDialog';
import getCodeSpec from '../code/codeSpecs';
import { PropertyRow, RowAction } from './PropertyUI';

const unboundValue = (value) => ({ isBind: false, value });

const ToggleCodeFormProperties = (props) => {
  const { content, selected, editComponent, setContent, label, name } = props;

  const type = selected ? selected.type.value : false;
  const group = selected ? selected.group.value : false;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(unboundValue(null));

  const callChangeProperties = (val) => {
    const newContent = editComponent([name], val, content);
    setContent([...newContent]);
  };

  // Editor dikosongkan = binding dilepas
  const onApply = (code) => {
    callChangeProperties(
      code ? { isBind: true, value: code } : unboundValue(false),
    );
    setOpen(false);
  };

  const onRemove = () => {
    callChangeProperties(unboundValue(false));
    setOpen(false);
  };

  useEffect(() => {
    if (selected) {
      const value = selected.properties[name];
      if (value) setValue(value);
    }
  }, [content, selected]);

  return (
    isValidProperties(name, group, type) && (
      <Box>
        <PropertyRow label={label}>
          {value.isBind && (
            <Typography variant="caption" color="primary">
              Bound
            </Typography>
          )}
          <RowAction
            title={value.isBind ? 'Edit binding' : 'Bind to code'}
            color={value.isBind ? 'primary.main' : 'text.secondary'}
            onClick={() => setOpen(true)}
          >
            <InsertLink />
          </RowAction>
          <Switch
            size="small"
            checked={value.isBind ? false : Boolean(value.value)}
            disabled={value.isBind}
            onChange={() => callChangeProperties(unboundValue(!value.value))}
          />
        </PropertyRow>
        <CodeDialog
          open={open}
          onClose={() => setOpen(false)}
          title={label}
          value={value.isBind ? value.value : null}
          spec={getCodeSpec(name, { group, type })}
          onApply={onApply}
          onRemove={value.isBind ? onRemove : null}
        />
      </Box>
    )
  );
};

export default ToggleCodeFormProperties;
