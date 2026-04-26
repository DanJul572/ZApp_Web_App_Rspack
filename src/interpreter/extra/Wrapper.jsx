import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const Wrapper = (props) => {
  const { children, component, isBuilder, selected, setSelected } = props;

  const theme = useTheme();

  if (!isBuilder) {
    return (
      <Box
        key={component.id}
        sx={{
          marginBottom: 1,
        }}
      >
        {children}
      </Box>
    );
  }

  const selectedBorder = selected && component.id === selected.id ? 1 : 0;
  return (
    <Box
      sx={{
        border: selectedBorder,
        borderColor: theme.palette.primary.main,
        borderRadius: 1,
        padding: 1,
        paddingBottom: 0,
      }}
      key={component.id}
    >
      {children}
      <Tooltip arrow title={component.type.label} placement="left">
        <IconButton onClick={() => setSelected(component)} sx={{ padding: 0 }}>
          <MoreHoriz />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Wrapper;
