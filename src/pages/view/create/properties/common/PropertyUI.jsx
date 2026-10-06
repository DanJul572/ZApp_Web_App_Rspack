import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

/**
 * Building block panel Properties. Gayanya mengikuti panel Component
 * (heading overline, baris body2 abu-abu, hover lembut) agar kedua panel
 * builder terlihat satu keluarga.
 */

const rowSx = {
  alignItems: 'center',
  color: 'text.secondary',
  display: 'flex',
  gap: 1,
  justifyContent: 'space-between',
  minHeight: 36,
  px: 1,
  py: 0.5,
};

/**
 * Kelompok properti dengan judul. Section otomatis disembunyikan jika
 * tidak ada properti yang berlaku untuk komponen terpilih.
 */
export const PropertySection = (props) => {
  const { title, children } = props;

  return (
    <Box sx={{ px: 2, '&:has(> [data-rows]:empty)': { display: 'none' } }}>
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{ display: 'block', mb: 0.5, px: 1 }}
      >
        {title}
      </Typography>
      <Box
        data-rows
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
      >
        {children}
      </Box>
    </Box>
  );
};

/** Ringkasan nilai di sisi kanan baris; kosong ditampilkan "Not set". */
export const ValuePreview = (props) => {
  const { value, mono } = props;

  const isEmpty = value === null || value === undefined || value === '';
  let text = 'Not set';
  if (!isEmpty) {
    text = typeof value === 'object' ? 'Set' : String(value).split('\n')[0];
  }

  return (
    <Typography
      variant="caption"
      noWrap
      sx={{
        color: isEmpty ? 'text.disabled' : 'text.primary',
        fontFamily: mono && !isEmpty ? '"Source Code Pro", monospace' : null,
        maxWidth: 150,
      }}
    >
      {text}
    </Typography>
  );
};

/**
 * Satu baris properti: label di kiri, kontrol di kanan. Jika `onClick`
 * diisi, seluruh baris menjadi tombol (mis. untuk membuka dialog).
 */
export const PropertyRow = (props) => {
  const { label, children, onClick } = props;

  const content = (
    <>
      <Typography variant="body2" noWrap sx={{ color: 'inherit' }}>
        {label}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 0.5,
          minWidth: 0,
          '& > .MuiSvgIcon-root': { fontSize: 18 },
        }}
      >
        {children}
      </Box>
    </>
  );

  if (onClick) {
    return (
      <ListItemButton
        onClick={onClick}
        sx={{ ...rowSx, '&:hover': { color: 'primary.main' } }}
      >
        {content}
      </ListItemButton>
    );
  }

  return <Box sx={rowSx}>{content}</Box>;
};

/** Tombol ikon kecil dengan tooltip untuk aksi di dalam baris. */
export const RowAction = (props) => {
  const {
    title,
    onClick,
    children,
    disabled,
    color = 'text.secondary',
  } = props;

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            color,
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

const optionSx = {
  borderColor: 'divider',
  color: 'text.secondary',
  height: 30,
  p: 0,
  width: 30,
  '& .MuiSvgIcon-root': { fontSize: 18 },
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: 'primary.50',
    borderColor: 'primary.200',
    color: 'primary.main',
  },
};

/** Sekumpulan tombol ikon (alignment, anchor, dekorasi teks, dll). */
export const OptionButtons = (props) => {
  const { options, isActive, onSelect } = props;

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {options.map((option) => (
        <Tooltip key={option.key} title={option.label}>
          <ToggleButton
            value={option.key}
            selected={isActive(option)}
            onChange={() => onSelect(option)}
            size="small"
            sx={optionSx}
          >
            {option.icon}
          </ToggleButton>
        </Tooltip>
      ))}
    </Box>
  );
};
