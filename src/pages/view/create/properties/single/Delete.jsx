import ContentCopy from '@mui/icons-material/ContentCopy';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MuiDeleteIcon from '@/aliaseses/MuiDeleteIcon';
import Confirm from '@/componentss/dialog/Confirm';
import CTheme from '@/constantss/CTheme';
import Translator from '@/hooks/Translator';

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
      <Box>
        <Box paddingX={2} display="flex" justifyContent="space-between">
          <Typography fontSize={CTheme.font.size.value}>
            {selected.type.label}
          </Typography>
          <Box>
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={() => setOpen(true)}
            >
              <MuiDeleteIcon fontSize={CTheme.font.size.name} />
            </IconButton>
            <IconButton
              sx={{ padding: 0 }}
              size={CTheme.button.size.name}
              onClick={duplicateComponent}
            >
              <ContentCopy fontSize={CTheme.font.size.name} />
            </IconButton>
          </Box>
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
