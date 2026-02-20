import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Code from '@/components/input/Code';

/**
 * PrimarySourceDrawer
 *
 * Props:
 *   open       : boolean
 *   onClose    : () => void
 *   value      : { name: string, sql: string }
 *   onChange   : (value: { name: string, sql: string }) => void
 */
const PrimarySourceDrawer = ({ open, onClose, value, onChange }) => {
  const handleNameChange = (e) => {
    onChange({ ...value, name: e.target.value });
  };

  const handleSqlChange = (sql) => {
    onChange({ ...value, sql });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 480, p: 0 } }}
    >
      {/* Header */}
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
          Primary Source
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box
        sx={{
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <TextField
          label="Name"
          placeholder="e.g. main_query"
          fullWidth
          size="small"
          value={value?.name ?? ''}
          onChange={handleNameChange}
        />

        <Code
          label="SQL Query"
          value={value?.sql ?? ''}
          onChange={handleSqlChange}
          withOptions={false}
        />
      </Box>

      {/* Footer */}
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

export default PrimarySourceDrawer;
