import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import Code from '@/components/input/Code';
import Translator from '@/hooks/Translator';
import { PropertyRow, ValuePreview } from '../common/PropertyUI';

const OnLoad = (props) => {
  const { page, setPage } = props;

  const translator = Translator();

  const [open, setOpen] = useState(false);
  const [onLoad, setOnLoad] = useState(null);

  const onApply = () => {
    const newPage = page ? { ...page } : {};
    newPage.onLoad = onLoad;
    setPage(newPage);
    setOpen(false);
  };

  useEffect(() => {
    if (page?.onLoad) setOnLoad(page.onLoad);
  }, [page]);

  return (
    <Box>
      <PropertyRow label="On Load" onClick={() => setOpen(true)}>
        <ValuePreview value={page?.onLoad} mono />
        <DataObject />
      </PropertyRow>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-hidden={open ? 'false' : 'true'}
      >
        <DialogTitle>On Load</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 500 }}>
            <Code value={onLoad} onChange={setOnLoad} />
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
  );
};

export default OnLoad;
