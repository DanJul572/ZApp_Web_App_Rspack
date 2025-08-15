import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import CTheme from '@/configs/CTheme';
import EDateTimeFormat from '@/enums/EDateTimeFormat';

const Datetime = (props) => {
  const { label, onChange, value, disabled } = props;

  const valueFormater = (val) => {
    const date = dayjs(val).format(EDateTimeFormat.datetime.value);
    return onChange(date);
  };

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={value ? dayjs(value) : null}
          onChange={valueFormater}
          disabled={disabled}
          format={EDateTimeFormat.datetime.display}
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

export default Datetime;
