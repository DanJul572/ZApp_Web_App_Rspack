import InsertLink from '@mui/icons-material/InsertLink';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Code from '@/components/input/Code';

import isValidProperties from '@/helpers/isValidProperties';
import Translator from '@/hooks/Translator';
import { PropertyRow, RowAction } from './PropertyUI';

const ToggleCodeFormProperties = (props) => {
  const { content, selected, editComponent, setContent, label, name } = props;

  const translator = Translator();

  const type = selected ? selected.type.value : false;
  const group = selected ? selected.group.value : false;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    isBind: false,
    value: null,
  });

  const onApply = () => {
    callChangeProperties(value);
    setOpen(false);
  };

  const onChange = (isBind, value) => {
    if (isBind) {
      setValue({
        isBind: true,
        value: value,
      });
    } else {
      const temValue = {
        isBind: false,
        value: value,
      };
      callChangeProperties(temValue);
    }
  };

  const onRemove = () => {
    const temValue = {
      isBind: false,
      value: false,
    };
    callChangeProperties(temValue);
    setOpen(false);
  };

  const callChangeProperties = (val) => {
    const newContent = editComponent([name], val, content);
    setContent([...newContent]);
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
            onChange={() => onChange(false, !value.value)}
          />
        </PropertyRow>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{label}</DialogTitle>
          <DialogContent>
            <Box sx={{ width: 500, paddingY: 1 }}>
              <Code
                value={!value.isBind ? null : value.value}
                onChange={(value) => onChange(true, value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              {translator('cancel')}
            </Button>
            <Button onClick={onRemove} variant="outlined">
              {translator('delete')}
            </Button>
            <Button onClick={onApply} variant="contained">
              {translator('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default ToggleCodeFormProperties;
