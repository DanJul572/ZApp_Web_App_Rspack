import * as Icon from '@mui/icons-material';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

const IconPicker = (props) => {
  const { onSelect } = props;
  const iconNames = Object.keys(Icon).filter((iconName) => {
    return (
      !iconName.includes('Outlined') &&
      !iconName.includes('Rounded') &&
      !iconName.includes('TwoTone') &&
      !iconName.includes('Sharp')
    );
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {iconNames.map((iconName) => {
        const IconComponent = Icon[iconName];
        return (
          <IconButton key={iconName} onClick={() => onSelect(iconName)}>
            <IconComponent />
          </IconButton>
        );
      })}
    </Box>
  );
};

export default IconPicker;
