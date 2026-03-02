import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useConfig } from '@/contexts/ConfigProvider';

const DateField = (props) => {
  const { label, onChange, value, disabled } = props;

  const { config } = useConfig();

  const valueFormater = (val) => {
    const date = dayjs(val).format(config.format.date.value);
    return onChange(date);
  };

  return (
    <Box>
      <Typography>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={valueFormater}
          disabled={disabled}
          format={config.format.date.display}
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

export default DateField;
