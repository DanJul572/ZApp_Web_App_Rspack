import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const NumberField = (props) => {
  const { label, onChange, value, rows, disabled } = props;

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, mb: label ? 0.75 : 0 }}
      >
        {label}
      </Typography>
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
