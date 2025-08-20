import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const LongText = (props) => {
  const { label, onChange, value, rows, disabled } = props;

  return (
    <Box>
      <Typography>{label}</Typography>
      <TextField
        variant="outlined"
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
