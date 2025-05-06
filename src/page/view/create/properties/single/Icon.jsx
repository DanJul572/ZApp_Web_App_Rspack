import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';

import IconPicker from '@/component/iconPicker';

import CButtonType from '@/constant/CButtonType';
import CComponentGroupType from '@/constant/CComponentGroupType';

const Icon = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const onApply = (icon) => {
    const newIcon = active && active === icon ? null : icon;
    const newContent = editComponent('icon', newIcon, content);
    setContent([...newContent]);
    setActive(newIcon);
  };

  const validComponent = () => {
    if (!selected) {
      return false;
    }

    if (
      selected.group.value === CComponentGroupType.button.value &&
      selected.type.value === CButtonType.button.value
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (selected) setActive(selected.properties.icon || null);
  }, [selected]);

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
              width: 567,
              height: 550,
            }}
          >
            <IconPicker active={active} onSelect={onApply} />
          </Card>
        </Modal>
      </Box>
    )
  );
};

export default Icon;
