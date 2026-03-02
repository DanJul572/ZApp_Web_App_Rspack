import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useConfig } from '@/contexts/ConfigProvider';

const Time = (props) => {
  const { label, onChange, value, disabled } = props;

  const { config } = useConfig();

  const valueFormater = (val) => {
    const time = dayjs(val).format(config.format.time.value);
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
          format={config.format.time.display}
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

export default Time;
