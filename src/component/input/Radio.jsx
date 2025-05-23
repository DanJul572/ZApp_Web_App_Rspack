import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

import MuiRadio from '@/alias/MuiRadio';

import CTheme from '@/constant/CTheme';

const Radio = (props) => {
  const { value, label, options, disabled, onChange } = props;

  const renderOptions = () => {
    if (!options || !options.length) return false;

    return (
      <RadioGroup row>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <MuiRadio
                checked={value === option.value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                size={CTheme.field.size.name}
              />
            }
            label={option.label}
            slotProps={{ typography: { fontSize: CTheme.font.size.value } }}
          />
        ))}
      </RadioGroup>
    );
  };

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      {renderOptions()}
    </Box>
  );
};

export default Radio;
