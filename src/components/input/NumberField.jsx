import CTheme from '@configs/CTheme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const NumberField = (props) => {
  const { label, onChange, value, rows, disabled } = props;

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <TextField
        variant="outlined"
        size={CTheme.field.size.name}
        fullWidth
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        disabled={disabled}
      />
    </Box>
  );
};

export default NumberField;
