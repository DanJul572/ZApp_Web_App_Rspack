import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';

import CButtonType from '@/constants/CButtonType';
import CComponentGroupType from '@/constants/CComponentGroupType';
import CContainerType from '@/constants/CContainerType';
import CInputType from '@/constants/CInputType';

const Color = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const theme = useTheme();

  const [active, setActive] = useState(null);

  const colors = [
    { label: 'Error', value: theme.palette.error.main, name: 'error' },
    { label: 'Success', value: theme.palette.success.main, name: 'success' },
    { label: 'Warning', value: theme.palette.warning.main, name: 'warning' },
    { label: 'Info', value: theme.palette.info.main, name: 'info' },
    {
      label: 'Secondary',
      value: theme.palette.secondary.main,
      name: 'secondary',
    },
    { label: 'Primary', value: theme.palette.primary.main, name: 'primary' },
  ];

  const onApply = (color) => {
    const newColor = active && active.name === color.name ? null : color;
    const newContent = editComponent('color', newColor, content);
    setContent([...newContent]);
    setActive(newColor);
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;
    const type = selected.type.value;

    if (
      group === CComponentGroupType.container.value &&
      type === CContainerType.collapse.value
    )
      return true;
    if (
      group === CComponentGroupType.container.value &&
      type === CContainerType.card.value
    )
      return true;
    if (
      group === CComponentGroupType.fieldControl.value &&
      type === CInputType.slider.value
    )
      return true;
    if (
      group === CComponentGroupType.button.value &&
      type === CButtonType.button.value
    )
      return true;
    if (
      group === CComponentGroupType.button.value &&
      type === CButtonType.group.value
    )
      return true;
    if (group === CComponentGroupType.visualElement.value) return true;
    return false;
  };

  useEffect(() => {
    if (selected) setActive(selected.properties.color || null);
  }, [selected]);

  const component = (color, index) => {
    return (
      <Box
        key={index}
        sx={{
          borderRadius: '50%',
          width: 15,
          height: 15,
          backgroundColor: color.value,
          cursor: 'pointer',
          border: active && color.name === active.name ? 2 : 0,
          borderColor: grey[300],
        }}
        onClick={() => onApply(color)}
      />
    );
  };

  return (
    validComponent() && (
      <Box paddingX={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          marginTop={1}
        >
          {colors.map(component)}
        </Box>
      </Box>
    )
  );
};

export default Color;
