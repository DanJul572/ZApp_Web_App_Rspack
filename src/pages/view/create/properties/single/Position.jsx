import CTheme from '@configs/CTheme';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import NumberField from '@/components/input/NumberField';
import ShortText from '@/components/input/ShortText';
import EComponentGroupType from '@/enums/EComponentGroupType';
import Translator from '@/hooks/Translator';

const Position = (props) => {
  const { selected, content, setContent, setSelected, deleteComponent } = props;

  const translator = Translator();

  const [containerID, setContainerID] = useState(null);
  const [columnIndex, setColumnIndex] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const changePosition = (content) => {
    const rowIndexInt = Number.parseInt(rowIndex, 10);
    const columnIndexInt = Number.parseInt(columnIndex, 10);

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
        if (component.group.value === EComponentGroupType.container.value) {
          for (let y = 0; y < component.section.length; y++) {
            const section = component.section[y];
            changePosition(section);
          }
        }
      }
    }
    return content;
  };

  const changePositionWithArrow = (arr, selectedId, direction) => {
    const index = arr.findIndex((item) => item.id === selectedId);

    if (index !== -1) {
      if (direction === 'up' && index > 0) {
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      } else if (direction === 'down' && index < arr.length - 1) {
        [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      }
      return true;
    }

    for (const item of arr) {
      if (item.section) {
        for (const section of item.section) {
          if (changePositionWithArrow(section, selectedId, direction))
            return true;
        }
      }
    }

    return false;
  };

  const onApply = () => {
    let newContent = deleteComponent(content);
    newContent = changePosition(newContent);

    setContent([...newContent]);
    setSelected(null);
    setOpen(false);
  };

  const onClickArrow = (direction) => {
    if (!selected) return;

    const selectedId = selected.id;
    const newContent = [...content];

    if (changePositionWithArrow(newContent, selectedId, direction)) {
      setContent(newContent);
    }
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
          <Box>
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={() => onClickArrow('up')}
            >
              <ArrowDropUp fontSize={CTheme.font.size.name} />
            </IconButton>
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={() => onClickArrow('down')}
            >
              <ArrowDropDown fontSize={CTheme.font.size.name} />
            </IconButton>
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={() => setOpen(true)}
            >
              <ShortTextOutlined fontSize={CTheme.font.size.name} />
            </IconButton>
          </Box>
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
              {translator('cancel')}
            </Button>
            <Button
              aria-hidden={open ? 'false' : 'true'}
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

export default Position;
