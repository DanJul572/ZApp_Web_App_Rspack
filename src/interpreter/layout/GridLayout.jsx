import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { useRef, useState } from 'react';
import { useBuilderActions } from './BuilderActions';
import { DropHint, dropSectionProps, emptySectionSx } from './DropSection';
import {
  addGridColumn,
  GRID_COLUMNS,
  parseGridSizes,
  removeGridColumn,
  resizeGridColumns,
  serializeGridSizes,
} from './gridColumns';

// Disembunyikan selama drag komponen agar tidak menutupi area drop
const HIDE_WHILE_DRAGGING = { 'body.builder-dragging &': { display: 'none' } };

const columnGuideSx = (theme) => {
  const line = alpha(theme.palette.primary.main, 0.25);
  const step = `calc(100% / ${GRID_COLUMNS})`;
  return {
    backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${step} - 1px), ${line} calc(${step} - 1px), ${line} ${step})`,
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  };
};

const ResizeHandle = (props) => {
  const { active, label, left, onPointerDown } = props;

  return (
    <Box
      data-dnd-ignore
      onPointerDown={onPointerDown}
      sx={{
        bottom: 0,
        cursor: 'col-resize',
        left,
        position: 'absolute',
        top: 0,
        touchAction: 'none',
        transform: 'translateX(-50%)',
        width: 12,
        zIndex: 3,
        '&::before': {
          backgroundColor: 'primary.main',
          borderRadius: 1,
          bottom: 4,
          content: '""',
          left: 'calc(50% - 1.5px)',
          opacity: active ? 1 : 0,
          position: 'absolute',
          top: 4,
          transition: 'opacity 120ms',
          width: 3,
        },
        '&:hover::before': { opacity: 1 },
        ...HIDE_WHILE_DRAGGING,
      }}
    >
      {active && (
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: 1,
            color: 'primary.contrastText',
            left: '50%',
            position: 'absolute',
            px: 0.75,
            top: -10,
            transform: 'translate(-50%, -100%)',
            typography: 'caption',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
};

/**
 * Grid di mode builder: tiap kolom adalah area drop, batas antar kolom
 * bisa di-drag untuk mengubah lebar (snap ke 12 kolom), dan kolom bisa
 * ditambah / dihapus langsung dari canvas.
 */
const GridBuilder = (props) => {
  const { columns, componentId, renderComponents, sizes } = props;

  const actions = useBuilderActions();
  const wrapper = useRef(null);
  // Ukuran sementara selama resize; content baru diubah saat pointer dilepas
  const [preview, setPreview] = useState(null);
  const current = preview?.sizes ?? sizes;

  const update = (nextSizes, sectionUpdater) =>
    actions?.updateComponent(componentId, (component) => ({
      ...component,
      properties: {
        ...component.properties,
        size: serializeGridSizes(nextSizes),
      },
      ...(sectionUpdater && {
        section: sectionUpdater(component.section ?? []),
      }),
    }));

  const startResize = (index) => (event) => {
    if (event.button !== 0) return;
    // Jangan sampai memicu drag komponen dari ComponentFrame
    event.stopPropagation();
    event.preventDefault();

    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const unit = wrapper.current.getBoundingClientRect().width / GRID_COLUMNS;
    const start = sizes.map(Math.round);
    let next = start;
    setPreview({ index, sizes: start });

    const onMove = (moveEvent) => {
      const delta = Math.round((moveEvent.clientX - startX) / unit);
      next = resizeGridColumns(start, index, delta);
      setPreview({ index, sizes: next });
    };

    const onEnd = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onEnd);
      handle.removeEventListener('pointercancel', onEnd);
      setPreview(null);
      if (next.some((size, i) => size !== sizes[i])) update(next);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onEnd);
    handle.addEventListener('pointercancel', onEnd);
  };

  // Handle hanya untuk batas di baris pertama (total <= 12)
  const handles = [];
  let offset = 0;
  for (let i = 0; i < current.length - 1; i++) {
    offset += current[i];
    if (offset >= GRID_COLUMNS) break;
    handles.push({ index: i, left: `${(offset / GRID_COLUMNS) * 100}%` });
  }

  return (
    <Box
      ref={wrapper}
      sx={{
        position: 'relative',
        '&:hover > .zgrid-add': { opacity: 1 },
        '&:hover > .MuiGrid-container > .zgrid-col': {
          outline: '1px dashed',
          outlineColor: 'divider',
          outlineOffset: -1,
        },
      }}
    >
      <Grid container>
        {columns.map((components, index) => {
          const isEmpty = components.length === 0;

          return (
            <Grid
              className="zgrid-col"
              size={current[index]}
              // Kolom grid bersifat posisional dan tidak punya id sendiri
              // biome-ignore lint/suspicious/noArrayIndexKey: column order is the identity
              key={index}
              {...dropSectionProps(true, componentId, index)}
              sx={{ position: 'relative', ...emptySectionSx(isEmpty) }}
            >
              {renderComponents(components)}
              {isEmpty && <DropHint />}
              {isEmpty && columns.length > 1 && (
                <Tooltip arrow title="Remove column">
                  <IconButton
                    size="small"
                    onClick={() =>
                      update(removeGridColumn(sizes, index), (section) =>
                        section.filter((_, i) => i !== index),
                      )
                    }
                    sx={{
                      position: 'absolute',
                      right: 2,
                      top: 2,
                      ...HIDE_WHILE_DRAGGING,
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          );
        })}
      </Grid>
      {preview && <Box sx={columnGuideSx} />}
      {handles.map((handle) => (
        <ResizeHandle
          key={handle.index}
          active={preview?.index === handle.index}
          label={`${current[handle.index]} | ${current[handle.index + 1]}`}
          left={handle.left}
          onPointerDown={startResize(handle.index)}
        />
      ))}
      <Tooltip arrow title="Add column">
        <IconButton
          className="zgrid-add"
          size="small"
          onClick={() => update(addGridColumn(sizes.map(Math.round)))}
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            opacity: 0,
            padding: 0.25,
            position: 'absolute',
            right: -6,
            top: -6,
            transition: 'opacity 120ms',
            zIndex: 4,
            '&:hover': { backgroundColor: 'background.paper' },
            ...HIDE_WHILE_DRAGGING,
          }}
        >
          <Add fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const GridLayout = (props) => {
  const { componentId, isBuilder, properties, renderComponents } = props;
  const section = props.section ?? [];

  // Di builder grid selalu punya minimal satu kolom sebagai area drop
  const sizes = parseGridSizes(
    properties.size,
    section.length,
    isBuilder ? 1 : 0,
  );
  const columns = sizes.map((_, i) => section[i] ?? []);

  if (isBuilder) {
    return (
      <GridBuilder
        columns={columns}
        componentId={componentId}
        renderComponents={renderComponents}
        sizes={sizes}
      />
    );
  }

  return (
    <Grid container>
      {columns.map((components, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: column order is the identity
        <Grid size={sizes[index]} key={index}>
          {renderComponents(components)}
        </Grid>
      ))}
    </Grid>
  );
};

export default GridLayout;
