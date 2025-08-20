import CTheme from '@configs/CTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import EDateTimeFormat from '@/enums/EDateTimeFormat';

const Time = (props) => {
  const { label, onChange, value, disabled } = props;

  const valueFormater = (val) => {
    const time = dayjs(val).format(EDateTimeFormat.time.value);
    return onChange(time);
  };

  return (
    <Box>
      <Typography>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={value ? dayjs(value) : null}
          onChange={valueFormater}
          disabled={disabled}
          format={EDateTimeFormat.time.display}
          slotProps={{
            textField: {
              disabled: disabled,
              fullWidth: true,
              size: CTheme.field.size.name,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Time;
