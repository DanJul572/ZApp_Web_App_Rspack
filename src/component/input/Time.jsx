import dayjs from 'dayjs';
import { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { ErrorContext } from '@/context/ErrorProvider';
import { validator } from '@/helper/validator';

import CDateTimeFormat from '@/constant/CDateTimeFormat';
import CTheme from '@/constant/CTheme';

const Time = (props) => {
  const { label, onChange, value, rules, name, group, disabled } = props;

  const { setError, clearError } = useContext(ErrorContext);

  const error = validator(rules, value ? value : '');

  useState(() => {
    if (!group && !name) {
      return;
    }
    if (!error.status) {
      return clearError(group, name);
    }
    setError(group, name, error.message);
  }, [value]);

  const valueFormater = (val) => {
    const time = dayjs(val).format(CDateTimeFormat.time.value);
    return onChange(time);
  };

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={value ? dayjs(value) : null}
          onChange={valueFormater}
          disabled={disabled}
          format={CDateTimeFormat.time.display}
          slotProps={{
            textField: {
              disabled: disabled,
              error: error.status,
              fullWidth: true,
              helperText: error.message,
              size: CTheme.field.size.name,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Time;
