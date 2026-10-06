import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiSlider from '@/aliases/MuiSlider';

const Slider = (props) => {
  const { label, onChange, value, disabled, color } = props;

  const change = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, mb: label ? 0.75 : 0 }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          padding: 1,
        }}
      >
        <MuiSlider
          color={color || 'primary'}
          disabled={disabled}
          onChange={change}
          value={value || 0}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default Slider;
