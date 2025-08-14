import ContentPaste from '@mui/icons-material/ContentPaste';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CComponentGroupType from '@/constantss/CComponentGroupType';
import CTheme from '@/constantss/CTheme';

const Identity = (props) => {
  const { selected } = props;

  const onCoppy = () => {
    if (!selected && !navigator.clipboard) return;
    navigator.clipboard.writeText(selected.id);
  };

  const validComponent = () => {
    if (!selected) return false;
    if (selected.group.value !== CComponentGroupType.container.value)
      return false;
    return true;
  };

  return (
    validComponent() && (
      <Box>
        <Box paddingX={2} display="flex" justifyContent="space-between">
          <Typography fontSize={CTheme.font.size.value}>
            {selected.id}
          </Typography>
          <IconButton
            sx={{ padding: 0 }}
            size={CTheme.button.size.name}
            onClick={onCoppy}
          >
            <ContentPaste fontSize={CTheme.font.size.name} />
          </IconButton>
        </Box>
      </Box>
    )
  );
};

export default Identity;
