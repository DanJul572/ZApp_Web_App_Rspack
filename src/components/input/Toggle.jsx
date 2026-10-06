import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const Toggle = (props) => {
  const { label, onChange, value, disabled } = props;

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, mb: label ? 0.75 : 0 }}
      >
        {label}
      </Typography>
      <Switch
        checked={Boolean(value)}
        value={Boolean(value)}
        onChange={() => (!disabled ? onChange(!value) : () => {})}
        disabled={disabled}
      />
    </Box>
  );
};

export default Toggle;
