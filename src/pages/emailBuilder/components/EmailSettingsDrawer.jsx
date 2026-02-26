import CloseIcon from '@mui/icons-material/Close';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MouseIcon from '@mui/icons-material/Mouse';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const PRIORITIES = [
  {
    value: 'high',
    label: 'High',
    description: 'Tandai sebagai urgent. Muncul di atas inbox.',
    color: 'error',
  },
  {
    value: 'normal',
    label: 'Normal',
    description:
      'Prioritas standar. Direkomendasikan untuk sebagian besar email.',
    color: 'primary',
  },
  {
    value: 'low',
    label: 'Low',
    description: 'Email non-urgent seperti newsletter atau notifikasi ringan.',
    color: 'default',
  },
];

const SettingRow = ({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderColor: checked ? 'primary.200' : 'divider',
      backgroundColor: checked ? 'primary.50' : 'background.paper',
      transition: 'all 0.2s',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        backgroundColor: checked ? 'primary.main' : 'action.selected',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size="small"
      disabled={disabled}
    />
  </Paper>
);

const EmailSettingsDrawer = ({ open, onClose, value, onChange }) => {
  const priority = value?.priority ?? 'normal';
  const openTracking = value?.openTracking ?? false;
  const clickTracking = value?.clickTracking ?? false;
  const unsubscribeLink = value?.unsubscribeLink ?? false;

  const set = (field, val) => onChange({ ...value, [field]: val });

  const activeCount = [openTracking, clickTracking, unsubscribeLink].filter(
    Boolean,
  ).length;

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
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Email Settings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Priority, tracking & compliance
          </Typography>
        </Box>
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
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            Priority Level
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1.5}
          >
            Mengatur header X-Priority pada email yang dikirim.
          </Typography>
          <Stack direction="row" spacing={1}>
            {PRIORITIES.map((p) => (
              <Paper
                key={p.value}
                variant="outlined"
                onClick={() => set('priority', p.value)}
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  borderColor:
                    priority === p.value ? `${p.color}.main` : 'divider',
                  backgroundColor:
                    priority === p.value
                      ? `${p.color === 'default' ? 'action' : p.color}.50`
                      : 'background.paper',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: `${p.color}.main` },
                  textAlign: 'center',
                }}
              >
                <Chip
                  label={p.label}
                  size="small"
                  color={p.color === 'default' ? 'default' : p.color}
                  variant={priority === p.value ? 'filled' : 'outlined'}
                  sx={{ mb: 0.75, fontWeight: 600, pointerEvents: 'none' }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1.3}
                >
                  {p.description}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <TrackChangesIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight={600}>
              Tracking
            </Typography>
            {activeCount > 0 && (
              <Chip
                label={`${activeCount} aktif`}
                size="small"
                color="primary"
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <SettingRow
              icon={<VisibilityIcon fontSize="small" sx={{ color: 'white' }} />}
              title="Open Tracking"
              description="Lacak siapa yang membuka email ini dan kapan."
              checked={openTracking}
              onChange={(val) => set('openTracking', val)}
            />

            <SettingRow
              icon={<MouseIcon fontSize="small" sx={{ color: 'white' }} />}
              title="Click Tracking"
              description="Lacak link mana yang diklik oleh penerima."
              checked={clickTracking}
              onChange={(val) => set('clickTracking', val)}
            />
          </Box>
        </Box>

        <Divider />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <NotificationsActiveIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight={600}>
              Compliance
            </Typography>
          </Box>

          <SettingRow
            icon={<LinkOffIcon fontSize="small" sx={{ color: 'white' }} />}
            title="Unsubscribe Link"
            description="Otomatis tambahkan footer unsubscribe (direkomendasikan untuk newsletter & marketing. Wajib untuk CAN-SPAM / GDPR compliance)."
            checked={unsubscribeLink}
            onChange={(val) => set('unsubscribeLink', val)}
          />

          {unsubscribeLink && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'warning.50',
                border: '1px solid',
                borderColor: 'warning.200',
              }}
            >
              <Typography variant="caption" color="warning.dark">
                ⚠️ Pastikan endpoint unsubscribe sudah dikonfigurasi di sisi
                backend sebelum mengirim email ke publik.
              </Typography>
            </Box>
          )}
        </Box>
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

export default EmailSettingsDrawer;
