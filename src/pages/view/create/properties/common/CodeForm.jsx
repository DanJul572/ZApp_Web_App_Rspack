import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import Code from '@/components/input/Code';

import isValidProperties from '@/helpers/isValidProperties';
import Translator from '@/hooks/Translator';
import { PropertyRow, ValuePreview } from './PropertyUI';

const CodeForm = (props) => {
  const { content, selected, editComponent, setContent, label, name } = props;

  const translator = Translator();

  const type = selected ? selected.type.value : false;
  const group = selected ? selected.group.value : false;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const onApply = () => {
    const newContent = editComponent(name, value, content);

    setContent([...newContent]);
    setOpen(false);
  };

  useEffect(() => {
    if (selected) setValue(selected.properties[name] || null);
  }, [selected]);

  return (
    isValidProperties(name, group, type) && (
      <Box>
        <PropertyRow label={label} onClick={() => setOpen(true)}>
          <ValuePreview value={selected.properties[name]} mono />
          <DataObject />
        </PropertyRow>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{label}</DialogTitle>
          <DialogContent>
            <Box sx={{ width: 500 }}>
              <Code value={value} onChange={setValue} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              {translator('cancel')}
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

export default CodeForm;
