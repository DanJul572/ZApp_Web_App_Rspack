import { useEffect, useState } from 'react';

import InsertLink from '@mui/icons-material/InsertLink';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Code from '@/component/input/Code';

import Translator from '@/hook/Translator';

import isValidProperties from '@/helper/isValidProperties';

import CTheme from '@/constant/CTheme';

const CodeForm = (props) => {
  const { content, selected, editComponent, setContent, label, name } = props;

  const { t } = Translator();

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
            <InsertLink />
          </IconButton>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{label}</DialogTitle>
          <DialogContent>
            <Box width={500}>
              <Code value={value} onChange={setValue} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              {t('cancel')}
            </Button>
            <Button onClick={onApply} variant="contained">
              {t('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default CodeForm;
