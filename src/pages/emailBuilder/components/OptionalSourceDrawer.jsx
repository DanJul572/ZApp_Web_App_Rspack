import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Code from '@/components/input/Code';

const createEntry = () => ({
  id: Date.now(),
  name: '',
  sql: '',
  expanded: true,
});

/**
 * OptionalSourceDrawer
 *
 * Props:
 *   open     : boolean
 *   onClose  : () => void
 *   value    : Array<{ id, name: string, sql: string }>
 *   onChange : (value: Array<{ id, name: string, sql: string }>) => void
 */
const OptionalSourceDrawer = ({ open, onClose, value = [], onChange }) => {
  // local expanded state per card
  const [expandedMap, setExpandedMap] = useState({});

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isExpanded = (id) => expandedMap[id] !== false; // default expanded

  const handleAdd = () => {
    const newEntry = createEntry();
    onChange([...value, { id: newEntry.id, name: '', sql: '' }]);
    setExpandedMap((prev) => ({ ...prev, [newEntry.id]: true }));
  };

  const handleDelete = (id) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleNameChange = (id, name) => {
    onChange(value.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const handleSqlChange = (id, sql) => {
    onChange(value.map((item) => (item.id === id ? { ...item, sql } : item)));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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
          width: '30vw',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Optional Sources
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
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {value.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.disabled',
            }}
          >
            <Typography variant="body2">No optional sources yet.</Typography>
            <Typography variant="caption">
              Click "+ Add Source" to get started.
            </Typography>
          </Box>
        )}

        {value.map((item, index) => (
          <Paper
            key={item.id}
            variant="outlined"
            sx={{ borderRadius: 2, overflow: 'hidden' }}
          >
            {/* Card Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                backgroundColor: 'action.hover',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => toggleExpand(item.id)}
            >
              <Typography
                variant="subtitle2"
                sx={{ flex: 1, color: 'text.secondary' }}
              >
                {item.name ? item.name : `Source ${index + 1}`}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                sx={{ color: 'error.main', mr: 0.5 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
              {isExpanded(item.id) ? (
                <ExpandLessIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
              ) : (
                <ExpandMoreIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
              )}
            </Box>

            {/* Card Body */}
            <Collapse in={isExpanded(item.id)}>
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <TextField
                  label="Name"
                  placeholder="e.g. secondary_query"
                  fullWidth
                  size="small"
                  value={item.name}
                  onChange={(e) => handleNameChange(item.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Code
                  label="SQL Query"
                  value={item.sql}
                  onChange={(sql) => handleSqlChange(item.id, sql)}
                  withOptions={false}
                />
              </Box>
            </Collapse>
          </Paper>
        ))}

        {/* Add Button */}
        <Button
          startIcon={<AddIcon />}
          variant="dashed"
          onClick={handleAdd}
          sx={{
            mt: value.length === 0 ? 0 : 1,
            border: '1px dashed',
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { backgroundColor: 'primary.50' },
          }}
          fullWidth
        >
          Add Source
        </Button>
      </Box>

      {/* Footer */}
      <Divider />
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {value.length} source{value.length !== 1 ? 's' : ''} configured
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onClose}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default OptionalSourceDrawer;
