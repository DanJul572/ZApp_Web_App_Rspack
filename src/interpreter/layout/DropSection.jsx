import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const DND_SECTION_SELECTOR = '[data-dnd-section]';
export const DND_ITEM_SELECTOR = '[data-dnd-item]';

const EMPTY_SECTION_SX = {
  outline: '1px dashed',
  outlineColor: 'divider',
  outlineOffset: -1,
  borderRadius: 1,
};

/**
 * Atribut penanda area drop di mode builder. Drag & drop view builder
 * membaca atribut ini langsung dari DOM, jadi tidak ada hook maupun
 * re-render selama drag.
 */
export const dropSectionProps = (
  isBuilder,
  containerId,
  colIndex = 0,
  direction = 'column',
) => {
  if (!isBuilder) return {};

  return {
    'data-dnd-section': '',
    'data-dnd-container': containerId ?? '',
    'data-dnd-col': colIndex,
    'data-dnd-direction': direction,
  };
};

export const emptySectionSx = (isEmpty) => (isEmpty ? EMPTY_SECTION_SX : {});

export const DropHint = () => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      minHeight: 48,
    }}
  >
    <Typography variant="caption" color="textSecondary">
      Drop component here
    </Typography>
  </Box>
);

/**
 * Pembungkus section untuk container yang tidak punya elemen sendiri
 * per section. Di luar mode builder hanya mengembalikan children.
 */
const DropSection = (props) => {
  const { children, colIndex, containerId, isBuilder, isEmpty } = props;

  if (!isBuilder) return children;

  return (
    <Box
      {...dropSectionProps(isBuilder, containerId, colIndex)}
      sx={emptySectionSx(isEmpty)}
    >
      {children}
      {isEmpty && <DropHint />}
    </Box>
  );
};

export default DropSection;
