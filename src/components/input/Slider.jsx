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
      <Typography>{label}</Typography>
      <Box padding={1}>
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
