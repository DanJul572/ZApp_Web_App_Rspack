import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useConfig } from '@/contexts/ConfigProvider';

const Datetime = (props) => {
  const { label, onChange, value, disabled } = props;

  const { config } = useConfig();

  const valueFormater = (val) => {
    const date = dayjs(val).format(config.format.datetime.value);
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
          format={config.format.datetime.display}
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
