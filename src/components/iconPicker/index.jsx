import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import * as Icon from '@/componentss/icons';

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
        // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
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
