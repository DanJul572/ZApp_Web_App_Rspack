import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';

import IconPicker from '@/component/iconPicker';

import CButtonType from '@/constant/CButtonType';

const Icon = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [open, setOpen] = useState(false);

  const onApply = (icon) => {
    const newContent = editComponent('icon', icon, content);
    setContent([...newContent]);
  };

  const validComponent = () => {
    if (!selected || selected.type.value !== CButtonType.button.value) {
      return false;
    }

    return true;
  };

  return (
    validComponent() && (
      <Box padding={2}>
        <Button variant="contained" fullWidth onClick={() => setOpen(true)}>
          Select Icon
        </Button>
        <Modal
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card
            sx={{
              padding: 2,
              overflowBlock: 'scroll',
              width: 567,
              height: 550,
            }}
          >
            <IconPicker onSelect={onApply} />
          </Card>
        </Modal>
      </Box>
    )
  );
};

export default Icon;
