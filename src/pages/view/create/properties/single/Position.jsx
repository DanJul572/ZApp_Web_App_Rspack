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
import Translator from '@/hooks/Translator';
import { insertComponent, shiftComponent } from '../../dnd/tree';
import { PropertyRow, RowAction } from '../common/PropertyUI';

const Position = (props) => {
  const { selected, content, setContent, setSelected, deleteComponent } = props;

  const translator = Translator();

  const [containerID, setContainerID] = useState(null);
  const [columnIndex, setColumnIndex] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const onApply = () => {
    const rowIndexInt = Number.parseInt(rowIndex, 10);
    const columnIndexInt = Number.parseInt(columnIndex, 10);

    // Kolom yang belum ada dibuat kosong agar komponen masuk ke kolom tujuan
    const newContent = insertComponent(deleteComponent(content), selected, {
      containerId: containerID || null,
      colIndex:
        containerID && !Number.isNaN(columnIndexInt) ? columnIndexInt : 0,
      index: Number.isNaN(rowIndexInt) ? 0 : rowIndexInt,
    });

    // Container tujuan tidak ditemukan: biarkan komponen di tempatnya
    if (newContent) {
      setContent(newContent);
      setSelected(null);
    }
    setOpen(false);
  };

  const onClickArrow = (direction) => {
    if (!selected) return;

    const newContent = shiftComponent(
      content,
      selected.id,
      direction === 'up' ? -1 : 1,
    );
    if (newContent !== content) setContent(newContent);
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
