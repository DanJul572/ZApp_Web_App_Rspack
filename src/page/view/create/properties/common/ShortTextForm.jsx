import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import ShortText from '@/component/input/ShortText';
import CTheme from '@/constant/CTheme';

import isValidProperties from '@/helper/isValidProperties';
import Translator from '@/hook/Translator';

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
          <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
          <IconButton
            sx={{ padding: 0 }}
            size={CTheme.button.size.name}
            onClick={() => setOpen(true)}
          >
            <ShortTextOutlined fontSize={CTheme.font.size.name} />
          </IconButton>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogContent>
            <Box>
              <ShortText label={label} value={value} onChange={setValue} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              size={CTheme.button.size.name}
            >
              {translator('cancel')}
            </Button>
            <Button
              onClick={onApply}
              variant="contained"
              size={CTheme.button.size.name}
            >
              {translator('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default ShortTextForm;
