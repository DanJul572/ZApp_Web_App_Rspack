import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import ShortText from '@/components/input/ShortText';

import isValidProperties from '@/helpers/isValidProperties';
import Translator from '@/hooks/Translator';

const ShortTextForm = (props) => {
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
        <Box
          paddingX={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{label}</Typography>
          <IconButton sx={{ padding: 0 }} onClick={() => setOpen(true)}>
            <ShortTextOutlined />
          </IconButton>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
          fullWidth
        >
          <DialogContent>
            <ShortText label={label} value={value} onChange={setValue} />
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

export default ShortTextForm;
