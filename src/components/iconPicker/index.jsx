import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Grid } from 'react-virtualized';
import DynamicIcon from '@/components/dynamicIcon';
import { formatIconName, parseIconName } from '@/helpers/parseIconName';

const IconPicker = ({ active, onSelect, onBlur }) => {
  const activeIcon = parseIconName(active);
  const activeName = activeIcon
    ? formatIconName(activeIcon.symbol, activeIcon.variant)
    : null;

  const [allNames, setAllNames] = useState(null);
  const [filter, setFilter] = useState(activeIcon?.variant ?? 'filled');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let ignore = false;
    // Loaded on demand so the ~60KB name list stays out of the main bundle
    import('@/configs/iconNames.json').then((module) => {
      if (!ignore) setAllNames(module.default);
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const iconNames = useMemo(() => {
    if (!allNames) return [];

    const term = searchTerm
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
    const symbols = term
      ? allNames.filter((name) => name.includes(term))
      : allNames;

    return symbols.map((symbol) => formatIconName(symbol, filter));
  }, [allNames, filter, searchTerm]);

  const rowHeight = 60;

  const cellRenderer = ({ columnIndex, rowIndex, key, style, parentProps }) => {
    const { columnCount } = parentProps;
    const iconIndex = rowIndex * columnCount + columnIndex;
    if (iconIndex >= iconNames.length) return null;

    const iconName = iconNames[iconIndex];

    return (
      <div key={key} style={style}>
        <IconButton
          data-testid={`icon-button-${iconName}`}
          title={parseIconName(iconName).symbol}
          color={activeName === iconName ? 'primary' : 'inherit'}
          onClick={onSelect ? () => onSelect(iconName) : undefined}
          onBlur={onBlur ? () => onBlur(iconName) : undefined}
        >
          <DynamicIcon name={iconName} />
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
        {!allNames || iconNames.length === 0 ? (
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
            {allNames ? 'No icon found.' : 'Loading icons...'}
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
