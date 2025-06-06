import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

import MuiCheckbox from '@/alias/MuiCheckbox';

import CTheme from '@/constant/CTheme';

const Checkbox = (props) => {
  const { value, label, options, disabled, onChange } = props;

  const values = value?.length ? value.split('|') : [];

  const setValues = (val) => {
    const deleteIndex = values.findIndex((value) => value === val);
    deleteIndex >= 0 ? values.splice(deleteIndex, 1) : values.push(val);

    onChange(values.join('|'));
  };

  const checked = (val) => {
    return !!values.find((value) => value === val);
  };

  const renderOptions = () => {
    if (!options || !options.length) return false;

    return (
      <FormGroup row>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <MuiCheckbox
                checked={checked(option.value)}
                value={option.value}
                onChange={(e) => setValues(e.target.value)}
                disabled={disabled}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    );
  };

  return (
    <Box>
      <Typography>{label}</Typography>
      {renderOptions()}
    </Box>
  );
};

export default Checkbox;
