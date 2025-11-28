import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';

import IconPicker from '@/components/iconPicker';
import Toggle from '@/components/input/Toggle';

import EButtonType from '@/enums/EButtonType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import ECustomType from '@/enums/ECustomType';

const Icon = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState({
    name: null,
    isRight: false,
  });

  const updateIcon = (updatedFields) => {
    const newIcon = { ...active, ...updatedFields };
    const newContent = editComponent('icon', newIcon, content);
    setContent([...newContent]);
    setActive(newIcon);
  };

  const onSelectIcon = (icon) => {
    updateIcon({ name: active?.name === icon ? null : icon });
  };

  const onChangePosition = () => {
    updateIcon({ isRight: !active.isRight });
  };

  const validComponent = () => {
    if (!selected) {
      return false;
    }

    return (
      (selected.group.value === EComponentGroupType.button.value &&
        selected.type.value === EButtonType.button.value) ||
      (selected.group.value === EComponentGroupType.custom.value &&
        selected.type.value === ECustomType.leftBorderCard.value)
    );
  };

  useEffect(() => {
    if (selected) {
      setActive(
        selected.properties.icon || {
          name: null,
          isRight: false,
        },
      );
    }
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
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Toggle
              label="On The Right"
              onChange={onChangePosition}
              value={active.isRight}
            />
            <IconPicker active={active.name} onSelect={onSelectIcon} />
          </Card>
        </Modal>
      </Box>
    )
  );
};

export default Icon;
