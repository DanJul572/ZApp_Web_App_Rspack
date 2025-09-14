import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Grid } from 'react-virtualized';
import * as Icon from '@/components/icons';

const IconPicker = ({ active, onSelect, onBlur }) => {
  const [filter, setFilter] = useState('filled');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const iconNames = useMemo(() => {
    let names = Object.keys(Icon);

    if (filter !== 'filled') {
      const suffix =
        filter === 'twoTone'
          ? 'TwoTone'
          : filter.charAt(0).toUpperCase() + filter.slice(1);

      names = names.filter((name) => name.endsWith(suffix));
    } else {
      names = names.filter(
        (name) =>
          !name.endsWith('Outlined') &&
          !name.endsWith('Rounded') &&
          !name.endsWith('TwoTone') &&
          !name.endsWith('Sharp'),
      );
    }

    if (searchTerm) {
      names = names.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return names;
  }, [filter, searchTerm]);

  const rowHeight = 60;

  const cellRenderer = ({ columnIndex, rowIndex, key, style, parentProps }) => {
    const { columnCount } = parentProps;
    const iconIndex = rowIndex * columnCount + columnIndex;
    if (iconIndex >= iconNames.length) return null;

    const iconName = iconNames[iconIndex];
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
    const IconComponent = Icon[iconName];

    return (
      <div key={key} style={style}>
        <IconButton
          color={active === iconName ? 'primary' : 'inherit'}
          onClick={onSelect ? () => onSelect(iconName) : undefined}
          onBlur={onBlur ? () => onBlur(iconName) : undefined}
        >
          <IconComponent />
        </IconButton>
      </div>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <FormControl size="small" sx={{ flex: '0 0 150px' }}>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="filled">Filled</MenuItem>
            <MenuItem value="outlined">Outlined</MenuItem>
            <MenuItem value="rounded">Rounded</MenuItem>
            <MenuItem value="twoTone">TwoTone</MenuItem>
            <MenuItem value="sharp">Sharp</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          fullWidth
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Box>

      <Box sx={{ height: 300 }}>
        {iconNames.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
              fontSize: 14,
            }}
          >
            No icon found.
          </Box>
        ) : (
          <AutoSizer>
            {({ width, height }) => {
              const minColumnWidth = 60;
              const columnCount = Math.max(
                1,
                Math.floor(width / minColumnWidth),
              );
              const columnWidth = Math.floor(width / columnCount);
              const rowCount = Math.ceil(iconNames.length / columnCount);

              const renderCell = (params) =>
                cellRenderer({ ...params, parentProps: { columnCount } });

              return (
                <Grid
                  style={{ overflowX: 'hidden' }}
                  cellRenderer={renderCell}
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  width={width}
                />
              );
            }}
          </AutoSizer>
        )}
      </Box>
    </Box>
  );
};

export default IconPicker;
