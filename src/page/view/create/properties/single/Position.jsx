import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';

import NumberField from '@/component/input/NumberField';
import ShortText from '@/component/input/ShortText';

import Translator from '@/hook/Translator';

import CComponentGroupType from '@/constant/CComponentGroupType';
import CTheme from '@/constant/CTheme';

const Position = (props) => {
  const { selected, content, setContent, setSelected, deleteComponent } = props;

  const { t } = Translator();

  const [containerID, setContainerID] = useState(null);
  const [columnIndex, setColumnIndex] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const changePosition = (content) => {
    const rowIndexInt = Number.parseInt(rowIndex);
    const columnIndexInt = Number.parseInt(columnIndex);

    if (!containerID) {
      content.splice(rowIndexInt, 0, selected);
    } else {
      for (let x = 0; x < content.length; x++) {
        const component = content[x];
        const id = component.id.toString();
        if (id === containerID) {
          if (!component.section[columnIndex]) {
            component.section.push([selected]);
          } else {
            component.section[columnIndexInt].splice(rowIndexInt, 0, selected);
          }
        }
        if (component.group.value === CComponentGroupType.container.value) {
          for (let y = 0; y < component.section.length; y++) {
            const section = component.section[y];
            changePosition(section);
          }
        }
      }
    }
    return content;
  };

  const onMove = () => {
    let newContent = deleteComponent(content);
    newContent = changePosition(newContent);

    setContent([...newContent]);
    setSelected(null);
    setOpen(false);
  };

  useEffect(() => {
    setContainerID(null);
    setColumnIndex(null);
    setRowIndex(null);
  }, [selected]);

  return (
    selected && (
      <Box>
        <Box
          paddingX={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize={CTheme.font.size.value}>Position</Typography>
          <IconButton
            sx={{ padding: 0 }}
            size={CTheme.button.size.name}
            onClick={() => setOpen(true)}
          >
            <ShortTextOutlined fontSize={CTheme.font.size.name} />
          </IconButton>
        </Box>
        <Dialog
          aria-hidden={open ? 'false' : 'true'}
          onClose={() => setOpen(false)}
          open={open}
        >
          <DialogTitle>Position</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={1} paddingY={1}>
              <ShortText
                label="Container ID"
                value={containerID}
                onChange={setContainerID}
              />
              <Box display="flex" gap={1}>
                <NumberField
                  label="Column"
                  value={columnIndex}
                  onChange={setColumnIndex}
                />
                <NumberField
                  label="Row"
                  value={rowIndex}
                  onChange={setRowIndex}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              aria-hidden={open ? 'false' : 'true'}
              onClick={() => setOpen(false)}
              variant="outlined"
              size={CTheme.button.size.name}
            >
              {t('cancel')}
            </Button>
            <Button
              aria-hidden={open ? 'false' : 'true'}
              onClick={onMove}
              variant="contained"
              size={CTheme.button.size.name}
            >
              {t('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default Position;
