import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import CTheme from '@/constantss/CTheme';

const Wraper = ({ children, component, isBuilder, selected, setSelected }) => {
  const theme = useTheme();

  if (!isBuilder)
    return (
      <Box key={component.id} marginBottom={1}>
        {children}
      </Box>
    );
  const selectedBorder =
    selected && component.id === selected.id ? CTheme.border.size.value : 0;
  return (
    <Box
      border={selectedBorder}
      borderColor={theme.palette.primary.main}
      borderRadius={1}
      key={component.id}
      padding={1}
      paddingBottom={0}
    >
      {children}
      <Tooltip arrow title={component.type.label} placement="left">
        <IconButton
          onClick={() => setSelected(component)}
          size={CTheme.button.size.name}
          sx={{ padding: 0 }}
        >
          <MoreHoriz fontSize={CTheme.font.size.name} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Wraper;
