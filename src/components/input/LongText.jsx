import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CTheme from '@/constantss/CTheme';

const LongText = (props) => {
  const { label, onChange, value, rows, disabled } = props;

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <TextField
        variant="outlined"
        size={CTheme.field.size.name}
        fullWidth
        multiline
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </Box>
  );
};

export default LongText;
