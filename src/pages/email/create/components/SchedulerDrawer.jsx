import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TodayIcon from '@mui/icons-material/Today';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Datetime from '@/components/input/Datetime';

const TYPES = [
  { label: 'Days', value: 'days', icon: <TodayIcon fontSize="small" /> },
  { label: 'Month', value: 'month', icon: <DateRangeIcon fontSize="small" /> },
  {
    label: 'Year',
    value: 'year',
    icon: <CalendarMonthIcon fontSize="small" />,
  },
];

const SchedulerDrawer = ({ open, onClose, value, onChange }) => {
  const handleStartTime = (val) => onChange({ ...value, startTime: val });
  const handleEndTime = (val) => onChange({ ...value, endTime: val });
  const handleType = (type) => onChange({ ...value, type });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Scheduler
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 3,
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '30vw',
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={500} mb={1}>
            Repeat Type
          </Typography>
          <Stack direction="row" spacing={1}>
            {TYPES.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                icon={t.icon}
                color={value?.type === t.value ? 'primary' : 'default'}
                variant={value?.type === t.value ? 'filled' : 'outlined'}
                onClick={() => handleType(t.value)}
                sx={{
                  px: 0.5,
                  fontWeight: value?.type === t.value ? 600 : 400,
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider />

        <Datetime
          label="Start Time"
          value={value?.startTime ?? null}
          onChange={handleStartTime}
        />

        <Datetime
          label="End Time"
          value={value?.endTime ?? null}
          onChange={handleEndTime}
        />

        {value?.type && value?.startTime && value?.endTime && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'primary.50',
              border: '1px solid',
              borderColor: 'primary.200',
            }}
          >
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              SCHEDULE SUMMARY
            </Typography>
            <Typography variant="body2" mt={0.5}>
              Runs every <strong>{value.type}</strong> from{' '}
              <strong>{value.startTime}</strong> to{' '}
              <strong>{value.endTime}</strong>
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onClose}>
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default SchedulerDrawer;
