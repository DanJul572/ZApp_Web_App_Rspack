import Box from '@mui/material/Box';

/**
 * Rounded square holding an icon. Used by page headers, section headers and
 * empty states so every page shares the same visual anchor.
 */
const IconTile = (props) => {
  const {
    children,
    color = 'primary',
    size = 40,
    variant = 'soft',
    sx,
  } = props;

  const isSolid = variant === 'solid';

  return (
    <Box
      sx={[
        (theme) => ({
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: `${Math.round(size * 0.28)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSolid
            ? theme.palette[color].contrastText
            : theme.palette[color].main,
          backgroundColor: isSolid
            ? theme.palette[color].main
            : theme.palette[color][100],
          backgroundImage: isSolid
            ? `linear-gradient(135deg, ${theme.palette[color].light} 0%, ${theme.palette[color].dark} 100%)`
            : 'none',
          '& .MuiSvgIcon-root': { fontSize: Math.round(size * 0.5) },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
};

export default IconTile;
