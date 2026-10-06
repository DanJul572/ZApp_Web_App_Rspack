import ContentCopy from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MuiDeleteIcon from '@/aliases/MuiDeleteIcon';
import Confirm from '@/components/dialog/Confirm';
import IconTile from '@/components/page/IconTile';
import Translator from '@/hooks/Translator';
import groupIcon from '../../groupIcon';
import { RowAction } from '../common/PropertyUI';

/** Header komponen terpilih beserta aksi duplikat dan hapus. */
const Delete = (props) => {
  const {
    selected,
    content,
    setContent,
    setSelected,
    deleteComponent,
    duplicateComponent,
  } = props;

  const translator = Translator();

  const [open, setOpen] = useState(false);

  const onDelete = (confirm) => {
    if (confirm) {
      const newContent = deleteComponent(content);
      setContent([...newContent]);
      setSelected(null);
    }
    setOpen(false);
  };

  return (
    selected && (
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            display: 'flex',
            gap: 1.5,
            p: 1.5,
          }}
        >
          <IconTile size={36}>{groupIcon(selected.group.value)}</IconTile>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {selected.type.label}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              noWrap
              sx={{ display: 'block' }}
            >
              {selected.group.label}
            </Typography>
          </Box>
          <RowAction title="Duplicate" onClick={duplicateComponent}>
            <ContentCopy />
          </RowAction>
          <RowAction
            title={translator('delete')}
            color="error.main"
            onClick={() => setOpen(true)}
          >
            <MuiDeleteIcon />
          </RowAction>
        </Box>
        <Confirm
          cancelButton={translator('cancel')}
          confirmButton={translator('delete')}
          onConfirm={onDelete}
          open={open}
          text={translator('confirm_delete')}
          title={translator('delete_data')}
        />
      </Box>
    )
  );
};

export default Delete;
