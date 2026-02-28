import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const EmailChipInput = ({ label, description, emails, onAdd, onRemove }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      setError('Invalid email address');
      return;
    }
    if (emails.includes(trimmed)) {
      setError('Email already added');
      return;
    }
    onAdd(trimmed);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      onRemove(emails[emails.length - 1]);
    }
  };

  return (
    <Box
      sx={{
        width: '30vw',
      }}
    >
      <Typography variant="body2" fontWeight={600} mb={0.5}>
        {label}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={1}
        >
          {description}
        </Typography>
      )}

      {emails.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
          {emails.map((email) => (
            <Chip
              key={email}
              label={email}
              size="small"
              variant="outlined"
              color="primary"
              onDelete={() => onRemove(email)}
              deleteIcon={<CloseIcon fontSize="small" />}
              sx={{ fontSize: 12 }}
            />
          ))}
        </Box>
      )}

      <TextField
        size="small"
        fullWidth
        placeholder="Type email and press Enter"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error || 'Press Enter or comma to add'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleAdd}
                disabled={!input.trim()}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

const CcBccDrawer = ({ open, onClose, value, onChange }) => {
  const cc = value?.cc ?? [];
  const bcc = value?.bcc ?? [];

  const addCc = (email) => onChange({ ...value, cc: [...cc, email] });
  const removeCc = (email) =>
    onChange({ ...value, cc: cc.filter((e) => e !== email) });
  const addBcc = (email) => onChange({ ...value, bcc: [...bcc, email] });
  const removeBcc = (email) =>
    onChange({ ...value, bcc: bcc.filter((e) => e !== email) });

  const totalCount = cc.length + bcc.length;

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
            CC & BCC
          </Typography>
          {totalCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {totalCount} recipient{totalCount !== 1 ? 's' : ''} configured
            </Typography>
          )}
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
        <EmailChipInput
          label="CC (Carbon Copy)"
          description="Recipients will be visible to all other recipients."
          emails={cc}
          onAdd={addCc}
          onRemove={removeCc}
        />

        <Divider />

        <EmailChipInput
          label="BCC (Blind Carbon Copy)"
          description="Recipients are hidden from all other recipients."
          emails={bcc}
          onAdd={addBcc}
          onRemove={removeBcc}
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

export default CcBccDrawer;
