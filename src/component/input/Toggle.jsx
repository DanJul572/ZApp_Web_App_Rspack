import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import CTheme from '@/constant/CTheme';

const Toggle = (props) => {
  const { label, onChange, value, disabled } = props;

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <Switch
        checked={Boolean(value)}
        value={Boolean(value)}
        onChange={() => onChange(!value)}
        disabled={disabled}
        size={CTheme.field.size.name}
      />
    </Box>
  );
};

export default Toggle;
