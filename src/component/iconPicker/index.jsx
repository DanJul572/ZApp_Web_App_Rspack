import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import * as Icon from '@/component/icons';

const IconPicker = (props) => {
  const { active, onSelect, onBlur } = props;

  const iconNames = Object.keys(Icon);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {iconNames.map((iconName) => {
        // biome-ignore format/all: This file is intentionally ignored
        const IconComponent = Icon[iconName];
        return (
          <IconButton
            color={active === iconName ? 'primary' : 'inherit'}
            key={iconName}
            onClick={onSelect ? () => onSelect(iconName) : () => {}}
            onBlur={onBlur ? () => onBlur(iconName) : () => {}}
            size="small"
          >
            <IconComponent fontSize="inherit" />
          </IconButton>
        );
      })}
    </Box>
  );
};

export default IconPicker;
