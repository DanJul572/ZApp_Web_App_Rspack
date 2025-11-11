import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import CDateTimeFormat from '@/configs/CDateTimeFormat';

const Datetime = (props) => {
  const { label, onChange, value, disabled } = props;

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
              fullWidth: true,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Datetime;
