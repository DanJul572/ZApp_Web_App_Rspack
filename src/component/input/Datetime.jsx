import dayjs from 'dayjs';
import { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { ErrorContext } from '@/context/ErrorProvider';
import { validator } from '@/helper/validator';

import CDateTimeFormat from '@/constant/CDateTimeFormat';
import CTheme from '@/constant/CTheme';

const Datetime = (props) => {
  const { label, onChange, value, rules, name, group, disabled } = props;

  const { setError, clearError } = useContext(ErrorContext);

  const error = validator(rules, value ? value : '');

  useState(() => {
    if (!group && !name) return;
    if (!error.status) return clearError(group, name);
    setError(group, name, error.message);
  }, [value]);

  const valueFormater = (val) => {
    const date = dayjs(val).format(CDateTimeFormat.datetime.value);
    return onChange(date);
  };

  return (
    <Box>
      <Typography>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={value ? dayjs(value) : null}
          onChange={valueFormater}
          disabled={disabled}
          format={CDateTimeFormat.datetime.display}
          slotProps={{
            textField: {
              disabled: disabled,
              error: error.status,
              fullWidth: true,
              helperText: error.message,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Datetime;
