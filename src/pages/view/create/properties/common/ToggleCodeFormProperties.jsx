import InsertLink from '@mui/icons-material/InsertLink';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import Code from '@/components/input/Code';
import Toggle from '@/components/input/Toggle';
import CTheme from '@/constants/CTheme';

import isValidProperties from '@/helpers/isValidProperties';
import Translator from '@/hooks/Translator';

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
        <Tooltip
          arrow
          title={value.isBind ? 'Is Bindding' : null}
          placement="left"
        >
          <Box
            paddingX={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Toggle
              value={value.isBind ? false : value.value}
              label={label}
              onChange={(value) => onChange(false, value)}
              disabled={value.isBind}
            />
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={() => setOpen(true)}
            >
              <InsertLink fontSize={CTheme.font.size.name} />
            </IconButton>
          </Box>
        </Tooltip>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{label}</DialogTitle>
          <DialogContent>
            <Box width={500} paddingY={1}>
              <Code
                value={!value.isBind ? null : value.value}
                onChange={(value) => onChange(true, value)}
              />
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
              onClick={onRemove}
              variant="outlined"
              size={CTheme.button.size.name}
            >
              {translator('delete')}
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

export default ToggleCodeFormProperties;
