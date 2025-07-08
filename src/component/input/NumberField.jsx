import { useContext, useEffect } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ErrorContext } from '@/context/ErrorProvider';
import { validator } from '@/helper/validator';

import CTheme from '@/constant/CTheme';

const NumberField = (props) => {
  const { label, onChange, value, rows, rules, name, group, disabled } = props;

  const { setError, clearError } = useContext(ErrorContext);

  const error = validator(rules, value ? value : '');

  useEffect(() => {
    if (!group && !name) {
      return;
    }
    if (!error.status) {
      return clearError(group, name);
    }
    setError(group, name, error.message);
  }, [value]);

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <TextField
        variant="outlined"
        size={CTheme.field.size.name}
        fullWidth
        rows={rows}
        value={value || ''}
        error={error.status}
        helperText={error.message}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        disabled={disabled}
      />
    </Box>
  );
};

export default NumberField;
