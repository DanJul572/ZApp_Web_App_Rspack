import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import CInputType from '@/constant/CInputType';
import CTheme from '@/constant/CTheme';

const Ratings = (props) => {
  const { value, onChange, label, disabled } = props;

  const handleChange = (event, newValue) => {
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
      <Typography fontSize={CTheme.font.size.value}>
        {label || CInputType.ratings.label}
      </Typography>
      <Rating disabled={disabled} value={value} onChange={handleChange} />
    </Box>
  );
};

export default Ratings;
