import { useContext, useEffect } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Help from '@mui/icons-material/Help';

import { ErrorContext } from '@/context/ErrorProvider';
import { validator } from '@/helper/validator';

import CTheme from '@/constant/CTheme';

const ShortText = (props) => {
  const {
    label,
    onChange,
    value,
    rules,
    group,
    name,
    disabled,
    onBlur,
    placeholder,
    tooltip,
  } = props;

  const { setError, clearError } = useContext(ErrorContext);

  const error = validator(rules, value);

  const blur = (e) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  const change = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow placement="top">
            <Help sx={{ fontSize: CTheme.font.size.value }} />
          </Tooltip>
        )}
      </Box>
      <TextField
        disabled={disabled}
        variant="outlined"
        size={CTheme.field.size.name}
        fullWidth
        value={value || ''}
        error={error.status}
        helperText={error.message}
        onChange={change}
        onBlur={blur}
        placeholder={placeholder || null}
      />
    </Box>
  );
};

export default ShortText;
