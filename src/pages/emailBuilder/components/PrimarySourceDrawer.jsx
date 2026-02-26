import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Code from '@/components/input/Code';
import ShortText from '@/components/input/ShortText';

const PrimarySourceDrawer = ({ open, onClose, value, onChange }) => {
  const handleNameChange = (name) => {
    onChange({ ...value, name: name });
  };

  const handleSqlChange = (sql) => {
    onChange({ ...value, sql: sql });
  };

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
          Primary Source
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

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
        <ShortText
          label="Name"
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
