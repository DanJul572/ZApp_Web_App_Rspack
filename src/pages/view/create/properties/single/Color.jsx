import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import isValidProperties from '@/helpers/isValidProperties';

const Color = (props) => {
  const { content, selected, editComponent, setContent, name } = props;

  const theme = useTheme();
  const [active, setActive] = useState(null);

  const type = selected ? selected.type.value : false;
  const group = selected ? selected.group.value : false;

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

  useEffect(() => {
    if (selected) setActive(selected.properties.color || null);
  }, [selected]);

  return (
    isValidProperties(name, group, type) && (
      <Box paddingX={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          marginTop={1}
        >
          {colors.map((color) => {
            return (
              <Box
                key={color.value}
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
          })}
        </Box>
      </Box>
    )
  );
};

export default Color;
