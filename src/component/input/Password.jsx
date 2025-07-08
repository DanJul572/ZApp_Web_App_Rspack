import { useContext, useEffect, useState } from 'react';

import { ErrorContext } from '@/context/ErrorProvider';
import { validator } from '@/helper/validator';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import CTheme from '@/constant/CTheme';

const Password = (props) => {
  const { label, onChange, value, rules, group, name, disabled, onBlur } =
    props;

  const { setError, clearError } = useContext(ErrorContext);

  const [showPassword, setShowPassword] = useState(false);

  const error = validator(rules, value);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
    <FormControl variant="outlined" fullWidth>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <OutlinedInput
        autoComplete="on"
        disabled={disabled}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        fullWidth
        name={name || 'password'}
        onBlur={blur}
        onChange={change}
        size={CTheme.field.size.name}
        type={showPassword ? 'text' : 'password'}
        value={value || ''}
        variant="outlined"
      />
    </FormControl>
  );
};

export default Password;
