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

import Translator from '@/hook/Translator';

import Code from '@/component/input/Code';

import CTheme from '@/constant/CTheme';

const OnLoad = (props) => {
  const { page, setPage } = props;

  const { t } = Translator();

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize={CTheme.font.size.value}>On Load</Typography>
        <IconButton
          sx={{ padding: 0 }}
          size={CTheme.button.size.name}
          onClick={() => setOpen(true)}
        >
          <InsertLink fontSize={CTheme.font.size.name} />
        </IconButton>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>On Load</DialogTitle>
        <DialogContent>
          <Box width={500}>
            <Code value={onLoad} onChange={setOnLoad} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            size={CTheme.button.size.name}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onApply}
            variant="contained"
            size={CTheme.button.size.name}
          >
            {t('apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnLoad;
