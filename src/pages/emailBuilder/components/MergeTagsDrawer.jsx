import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

/**
 * MergeTagsDrawer
 *
 * Props:
 *   open          : boolean
 *   onClose       : () => void
 *   value         : Array<{ id, tag: string, column: string, defaultValue: string }>
 *   onChange      : (value) => void
 *   primarySource : { name: string, sql: string }
 */

const createTag = () => ({
  id: Date.now(),
  tag: '',
  column: '',
  defaultValue: '',
});

const SUGGESTED_TAGS = [
  { tag: 'name', column: 'user.name' },
  { tag: 'email', column: 'user.email' },
  { tag: 'role', column: 'user.role_id' },
];

const MergeTagsDrawer = ({
  open,
  onClose,
  value = [],
  onChange,
  primarySource,
}) => {
  const [copied, setCopied] = useState(null);

  const handleAdd = () => {
    onChange([...value, createTag()]);
  };

  const handleDelete = (id) => {
    onChange(value.filter((t) => t.id !== id));
  };

  const handleFieldChange = (id, field, val) => {
    onChange(value.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  };

  const handleCopy = (tag) => {
    navigator.clipboard.writeText(`{{${tag}}}`);
    setCopied(tag);
    setTimeout(() => setCopied(null), 1500);
  };

  const addSuggested = (suggested) => {
    const exists = value.find((t) => t.tag === suggested.tag);
    if (!exists) {
      onChange([
        ...value,
        {
          id: Date.now(),
          tag: suggested.tag,
          column: suggested.column,
          defaultValue: '',
        },
      ]);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: '30vw',
        }}
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
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Variable / Merge Tags
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Use {'{{tag}}'} syntax inside the email template
            </Typography>
          </Box>
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
            gap: 3,
          }}
        >
          {/* Info */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              gap: 1.5,
              backgroundColor: 'info.50',
              borderColor: 'info.200',
              borderRadius: 2,
            }}
          >
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ color: 'info.main', mt: 0.2, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="body2" fontWeight={600} color="info.main">
                How to use
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={0.3}
              >
                Add a tag then type <strong>{'{{tag_name}}'}</strong> inside the
                email editor. The column must match the name of the SQL result
                column from the primary/optional source.
              </Typography>
            </Box>
          </Paper>

          {/* Source info */}
          {primarySource?.name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Active source:
              </Typography>
              <Chip
                label={primarySource.name}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          )}

          {/* Quick add suggestions */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              mb={1}
            >
              Quick add
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {SUGGESTED_TAGS.map((s) => {
                const exists = value.find((t) => t.tag === s.tag);
                return (
                  <Chip
                    key={s.tag}
                    label={`{{${s.tag}}}`}
                    size="small"
                    variant={exists ? 'filled' : 'outlined'}
                    color={exists ? 'success' : 'default'}
                    onClick={() => addSuggested(s)}
                    disabled={!!exists}
                    sx={{ fontFamily: 'monospace', fontSize: 11 }}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider />

          {/* Tag list */}
          {value.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
              <Typography variant="body2">
                There are no merge tags yet.
              </Typography>
              <Typography variant="caption">
                Click "+ Add Tag" to start.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {value.map((tag, index) => (
                <Paper
                  key={tag.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      TAG #{index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {tag.tag && (
                        <Tooltip
                          title={
                            copied === tag.tag
                              ? 'Copied!'
                              : `Copy {{${tag.tag}}}`
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(tag.tag)}
                          >
                            <ContentCopyIcon
                              fontSize="small"
                              sx={{
                                color:
                                  copied === tag.tag
                                    ? 'success.main'
                                    : 'text.secondary',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(tag.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 1.5,
                    }}
                  >
                    <TextField
                      label="Tag Name"
                      size="small"
                      fullWidth
                      value={tag.tag}
                      onChange={(e) =>
                        handleFieldChange(
                          tag.id,
                          'tag',
                          e.target.value.replace(/\s/g, '_').toLowerCase(),
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              fontFamily: 'monospace',
                              color: 'text.secondary',
                            }}
                          >
                            {'{{'}{' '}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{
                              fontFamily: 'monospace',
                              color: 'text.secondary',
                            }}
                          >
                            {'}}'}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="SQL Column Name"
                      placeholder="source_name.column_name"
                      size="small"
                      fullWidth
                      value={tag.column}
                      onChange={(e) =>
                        handleFieldChange(tag.id, 'column', e.target.value)
                      }
                    />
                    <TextField
                      label="Default Value"
                      placeholder="if column is empty"
                      size="small"
                      fullWidth
                      value={tag.defaultValue}
                      onChange={(e) =>
                        handleFieldChange(
                          tag.id,
                          'defaultValue',
                          e.target.value,
                        )
                      }
                      sx={{ gridColumn: '1 / -1' }}
                    />
                  </Box>

                  {tag.tag && (
                    <Box
                      sx={{
                        mt: 1.5,
                        px: 1.5,
                        py: 0.75,
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontFamily="monospace"
                        color="primary.main"
                      >
                        {`{{${tag.tag}}}`}
                      </Typography>
                      {tag.column && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          ml={1}
                        >
                          → column: <strong>{tag.column}</strong>
                        </Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}

          {/* Add button */}
          <Button
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAdd}
            sx={{
              border: '1px dashed',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'primary.50' },
            }}
          >
            Add Tag
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
            {value.length} tag{value.length !== 1 ? 's' : ''} added
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
      </Box>
    </Drawer>
  );
};

export default MergeTagsDrawer;
