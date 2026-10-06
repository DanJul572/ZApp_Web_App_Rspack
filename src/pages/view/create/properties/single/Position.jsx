import North from '@mui/icons-material/North';
import South from '@mui/icons-material/South';
import Tune from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import NumberField from '@/components/input/NumberField';
import ShortText from '@/components/input/ShortText';
import EComponentGroupType from '@/enums/EComponentGroupType';
import Translator from '@/hooks/Translator';
import { PropertyRow, RowAction } from '../common/PropertyUI';

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
        <PropertyRow label="Position">
          <RowAction title="Move up" onClick={() => onClickArrow('up')}>
            <North />
          </RowAction>
          <RowAction title="Move down" onClick={() => onClickArrow('down')}>
            <South />
          </RowAction>
          <RowAction title="Set position" onClick={() => setOpen(true)}>
            <Tune />
          </RowAction>
        </PropertyRow>
        <Dialog
          aria-hidden={open ? 'false' : 'true'}
          onClose={() => setOpen(false)}
          open={open}
          fullWidth
        >
          <DialogTitle>Position</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                paddingY: 1,
              }}
            >
              <ShortText
                label="Container ID"
                value={containerID}
                onChange={setContainerID}
              />
              <Grid container spacing={1}>
                <Grid size={6}>
                  <NumberField
                    label="Column"
                    value={columnIndex}
                    onChange={setColumnIndex}
                  />
                </Grid>
                <Grid size={6}>
                  <NumberField
                    label="Row"
                    value={rowIndex}
                    onChange={setRowIndex}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              aria-hidden={open ? 'false' : 'true'}
              onClick={() => setOpen(false)}
              variant="outlined"
            >
              {translator('cancel')}
            </Button>
            <Button
              aria-hidden={open ? 'false' : 'true'}
              onClick={onApply}
              variant="contained"
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
