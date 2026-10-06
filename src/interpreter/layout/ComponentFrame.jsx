import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

/**
 * Pembungkus setiap komponen. Di mode builder menampilkan border seleksi
 * dan tombol untuk memilih komponen.
 */
const ComponentFrame = (props) => {
  const { children, component, isBuilder, selected, setSelected } = props;

  const theme = useTheme();

  if (!isBuilder) {
    return <Box sx={{ marginBottom: 1 }}>{children}</Box>;
  }

  const isSelected = selected && component.id === selected.id;

  return (
    <Box
      sx={{
        border: isSelected ? 1 : 0,
        borderColor: theme.palette.primary.main,
        borderRadius: 1,
        padding: 1,
        paddingBottom: 0,
      }}
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

export default ComponentFrame;
