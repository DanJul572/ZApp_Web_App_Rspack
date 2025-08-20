import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import EInputType from '@/enums/EInputType';

const Ratings = (props) => {
  const { value, onChange, label, disabled } = props;

  const handleChange = (_event, newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography>{label || EInputType.ratings.label}</Typography>
      <Rating disabled={disabled} value={value} onChange={handleChange} />
    </Box>
  );
};

export default Ratings;
