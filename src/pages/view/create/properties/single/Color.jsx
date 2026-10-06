import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import isValidProperties from '@/helpers/isValidProperties';
import { PropertyRow } from '../common/PropertyUI';

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
      <PropertyRow label="Color">
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {colors.map((color) => {
            const isActive = active?.name === color.name;

            return (
              <Tooltip key={color.name} title={color.label}>
                <ButtonBase
                  aria-label={color.label}
                  aria-pressed={isActive}
                  onClick={() => onApply(color)}
                  sx={{
                    backgroundColor: color.value,
                    borderRadius: '50%',
                    height: 18,
                    width: 18,
                    // Ring dua lapis agar terlihat di atas warna apa pun
                    boxShadow: isActive
                      ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 3.5px ${color.value}`
                      : 'none',
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </PropertyRow>
    )
  );
};

export default Color;
