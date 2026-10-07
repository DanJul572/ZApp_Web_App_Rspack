import Search from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import apiCatalog from '@/interpreter/script/apiCatalog';

const monoSx = {
  fontFamily: '"Source Code Pro", Consolas, monospace',
  fontSize: 12,
};

const itemSx = {
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
  px: 1.5,
  py: 1,
};

const EmptyText = ({ children }) => (
  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
    {children}
  </Typography>
);

/**
 * Panel samping editor kode: tab template siap pakai dan referensi API
 * (isi `param` + apiCatalog) yang disaring sesuai jenis kode property.
 */
const CodeHelpPanel = (props) => {
  const { spec, onInsert, onApplyTemplate } = props;

  const [tab, setTab] = useState(spec.templates.length > 0 ? 0 : 1);
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const matches = (item) =>
      !keyword ||
      item.code.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const paramGroup = { group: 'param', items: spec.params };
    const catalogGroups = apiCatalog.map((group) => ({
      group: group.group,
      items: group.items.filter((item) => item.kinds.includes(spec.kind)),
    }));

    return [paramGroup, ...catalogGroups]
      .map((group) => ({ ...group, items: group.items.filter(matches) }))
      .filter((group) => group.items.length > 0);
  }, [spec, search]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 440,
        minWidth: 0,
      }}
    >
      <Tabs
        value={tab}
        onChange={(_event, value) => setTab(value)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
      >
        <Tab label="Templates" sx={{ minHeight: 40 }} />
        <Tab label="Reference" sx={{ minHeight: 40 }} />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ overflow: 'auto' }}>
          {spec.templates.length === 0 && (
            <EmptyText>No templates for this property yet.</EmptyText>
          )}
          <List disablePadding>
            {spec.templates.map((template) => (
              <ListItemButton
                key={template.title}
                divider
                onClick={() => onApplyTemplate(template)}
                sx={itemSx}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {template.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {template.description}
                </Typography>
                <Typography
                  component="pre"
                  sx={{
                    ...monoSx,
                    color: 'text.secondary',
                    m: 0,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre',
                  }}
                >
                  {template.code.split('\n').slice(0, 3).join('\n')}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}

      {tab === 1 && (
        <>
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Click to insert at the cursor.
            </Typography>
          </Box>
          <Box sx={{ overflow: 'auto' }}>
            {groups.length === 0 && <EmptyText>No matches.</EmptyText>}
            <List disablePadding>
              {groups.map((group) => (
                <li key={group.group}>
                  <List disablePadding>
                    <ListSubheader sx={{ lineHeight: '32px' }}>
                      {group.group}
                    </ListSubheader>
                    {group.items.map((item) => (
                      <ListItemButton
                        key={item.code}
                        onClick={() => onInsert(item.code)}
                        sx={itemSx}
                      >
                        <Typography
                          sx={{ ...monoSx, wordBreak: 'break-word' }}
                          color="primary"
                        >
                          {item.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </li>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CodeHelpPanel;
