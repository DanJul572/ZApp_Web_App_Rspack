import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const NumberField = (props) => {
  const { label, onChange, value, rows, disabled } = props;

  return (
    <Box>
      <Typography>{label}</Typography>
      <TextField
        variant="outlined"
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
