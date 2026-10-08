import { useDraggable } from '@dnd-kit/core';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useBuilderSelection } from './BuilderSelection';

const BuilderFrame = (props) => {
  const { children, component } = props;

  const { isDragging, listeners, setNodeRef } = useDraggable({
    id: component.id,
    data: {
      kind: 'existing',
      id: component.id,
      label: component.type.label,
    },
  });

  const { isSelected, select } = useBuilderSelection(component.id);

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      data-dnd-item={component.id}
      sx={{
        borderRadius: 1,
        opacity: isDragging ? 0.4 : 1,
        padding: 1,
        paddingBottom: 0,
        position: 'relative',
        // Indikator seleksi digambar di dalam padding frame: tidak menggeser
        // layout dan tidak terpotong radius/overflow container seperti Card
        '&::after': isSelected
          ? {
              border: '1.5px solid',
              borderColor: 'primary.main',
              borderRadius: '8px',
              content: '""',
              inset: '3px',
              pointerEvents: 'none',
              position: 'absolute',
              zIndex: 2,
            }
          : null,
      }}
    >
      {children}
      <Tooltip arrow title={component.type.label} placement="left">
        <IconButton
          onClick={() => select?.(component)}
          sx={{ cursor: 'grab', padding: 0 }}
        >
          <MoreHoriz />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

/**
 * Pembungkus setiap komponen. Di mode builder menampilkan border seleksi,
 * tombol untuk memilih komponen, dan menjadi sumber drag.
 */
const ComponentFrame = (props) => {
  const { children, isBuilder } = props;

  if (!isBuilder) {
    return <Box sx={{ marginBottom: 1 }}>{children}</Box>;
  }

  return <BuilderFrame {...props} />;
};

export default ComponentFrame;
