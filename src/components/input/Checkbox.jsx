import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

import MuiCheckbox from '@/aliaseses/MuiCheckbox';

import CTheme from '@/constantss/CTheme';

const Checkbox = (props) => {
  const { value, label, options, disabled, onChange } = props;

  const values = value?.length ? value.splitranslator('|') : [];

  const setValues = (val) => {
    const deleteIndex = values.findIndex((value) => value === val);
    deleteIndex >= 0 ? values.splice(deleteIndex, 1) : values.push(val);
    onChange(values.join('|'));
  };

  const checked = (val) => {
    return !!values.find((value) => value === val);
  };

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      {options?.length && (
        <FormGroup row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <MuiCheckbox
                  checked={checked(option.value)}
                  value={option.value}
                  size={CTheme.field.size.name}
                  onChange={(e) => setValues(e.target.value)}
                  disabled={disabled}
                />
              }
              slotProps={{ typography: { fontSize: CTheme.font.size.value } }}
              label={option.label}
            />
          ))}
        </FormGroup>
      )}
    </Box>
  );
};

export default Checkbox;
