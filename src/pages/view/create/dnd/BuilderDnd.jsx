import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DragIndicator from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import { useEffect, useMemo, useRef } from 'react';
import { BuilderActionsContext } from '@/interpreter/layout/BuilderActions';
import {
  DND_ITEM_SELECTOR,
  DND_SECTION_SELECTOR,
} from '@/interpreter/layout/DropSection';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';
import { PANEL_WIDTH } from '../constants';
import {
  createComponent,
  findComponent,
  insertComponent,
  moveComponent,
  updateComponent,
} from './tree';

const INTERACTIVE_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [data-dnd-ignore]';
// Class di body selama drag, dipakai kontrol canvas untuk menyembunyikan diri
const DRAGGING_CLASS = 'builder-dragging';
const DRAG_DISTANCE = 4;
const SCROLL_EDGE = 80;
const SCROLL_MAX_SPEED = 20;

// Drag tidak dimulai dari input agar teks di dalamnya tetap bisa dipilih
class BuilderPointerSensor extends PointerSensor {}

BuilderPointerSensor.activators = [
  {
    eventName: 'onPointerDown',
    handler: ({ nativeEvent: event }, { onActivation }) => {
      if (!event.isPrimary || event.button !== 0) return false;
      if (event.target.closest?.(INTERACTIVE_SELECTOR)) return false;

      onActivation?.({ event });
      return true;
    },
  },
];

const rectStyle = (element, rect) => {
  element.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
  element.style.display = 'block';
};

/**
 * Cari section dan posisi sisip di bawah pointer. Section di dalam
 * komponen yang sedang di-drag dilewati agar container tidak bisa
 * dimasukkan ke dirinya sendiri.
 */
const resolveTarget = (x, y, draggedNode) => {
  let section = document.elementFromPoint(x, y)?.closest(DND_SECTION_SELECTOR);

  if (section && draggedNode?.contains(section)) {
    section = draggedNode.parentElement?.closest(DND_SECTION_SELECTOR);
  }
  if (!section) return null;

  const sectionRect = section.getBoundingClientRect();
  const items = [...section.querySelectorAll(DND_ITEM_SELECTOR)].filter(
    (item) => item.parentElement.closest(DND_SECTION_SELECTOR) === section,
  );

  if (items.length === 0) {
    return {
      drop: {
        containerId: section.dataset.dndContainer || null,
        colIndex: Number(section.dataset.dndCol) || 0,
      },
      sectionRect,
      line: null,
    };
  }

  const rects = items.map((item) => item.getBoundingClientRect());
  const isRow = section.dataset.dndDirection === 'row';

  // Untuk flex row yang wrap, utamakan item di baris yang sama dengan pointer
  let pool = rects.map((_, i) => i);
  if (isRow) {
    const sameLine = pool.filter(
      (i) => y >= rects[i].top && y <= rects[i].bottom,
    );
    if (sameLine.length > 0) pool = sameLine;
  }

  const hit = pool.find((i) =>
    isRow
      ? x < rects[i].left + rects[i].width / 2
      : y < rects[i].top + rects[i].height / 2,
  );
  const isAfter = hit === undefined;
  const index = isAfter ? pool[pool.length - 1] : hit;
  const rect = rects[index];
  const id = items[index].dataset.dndItem;

  let line;
  if (isRow) {
    line = {
      left: (isAfter ? rect.right : rect.left) - 1.5,
      top: rect.top,
      width: 3,
      height: rect.height,
    };
  } else {
    const previous = !isAfter && index > 0 ? rects[index - 1] : null;
    let lineY = isAfter ? rect.bottom + 2 : rect.top - 2;
    if (previous) lineY = (previous.bottom + rect.top) / 2;
    line = { left: rect.left, top: lineY - 1.5, width: rect.width, height: 3 };
  }

  return {
    drop: isAfter ? { afterId: id } : { beforeId: id },
    sectionRect,
    line,
  };
};

const scrollSpeed = ({ x, y }) => {
  if (x < PANEL_WIDTH || x > window.innerWidth - PANEL_WIDTH) return 0;

  const top = TOPBAR_HEIGHT + SCROLL_EDGE;
  if (y < top) {
    return -Math.ceil(SCROLL_MAX_SPEED * Math.min(1, (top - y) / SCROLL_EDGE));
  }

  const bottom = window.innerHeight - SCROLL_EDGE;
  if (y > bottom) {
    return Math.ceil(
      SCROLL_MAX_SPEED * Math.min(1, (y - bottom) / SCROLL_EDGE),
    );
  }
  return 0;
};

const overlaySx = {
  display: 'none',
  left: 0,
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  zIndex: 2000,
};

/**
 * Engine drag yang dibuat sekali per BuilderDnd. Semua handler hanya
 * membaca ref, sehingga referensinya stabil untuk add/removeEventListener.
 */
const createDragEngine = (refs) => {
  const { chip, chipLabel, highlight, line, latest } = refs;

  let drag = null;
  let pointer = { x: 0, y: 0 };
  let frame = 0;

  const moveChip = () => {
    chip.current.style.transform = `translate3d(${pointer.x + 14}px, ${pointer.y + 14}px, 0)`;
  };

  const paint = (result) => {
    moveChip();

    if (!result) {
      highlight.current.style.display = 'none';
      line.current.style.display = 'none';
      return;
    }

    rectStyle(highlight.current, result.sectionRect);
    if (result.line) {
      rectStyle(line.current, result.line);
    } else {
      line.current.style.display = 'none';
    }
  };

  const tick = () => {
    frame = 0;
    if (!drag) return;

    const speed = scrollSpeed(pointer);
    if (speed) window.scrollBy(0, speed);

    paint(resolveTarget(pointer.x, pointer.y, drag.node));

    // Terus scroll selama pointer diam di tepi layar
    if (speed) schedule();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  };

  const stop = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', schedule, true);
    cancelAnimationFrame(frame);
    frame = 0;
    drag = null;
    document.body.style.cursor = '';
    document.body.classList.remove(DRAGGING_CLASS);

    for (const element of [chip, highlight, line]) {
      if (element.current) element.current.style.display = 'none';
    }
  };

  const onDragStart = ({ active, activatorEvent }) => {
    const data = active.data.current;

    drag = {
      data,
      node:
        data.kind === 'existing'
          ? document.querySelector(`[data-dnd-item="${CSS.escape(data.id)}"]`)
          : null,
    };
    pointer = { x: activatorEvent.clientX, y: activatorEvent.clientY };

    chipLabel.current.textContent = data.label;
    chip.current.style.display = 'flex';
    moveChip();
    document.body.style.cursor = 'grabbing';
    document.body.classList.add(DRAGGING_CLASS);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', schedule, {
      capture: true,
      passive: true,
    });
    schedule();
  };

  const onDragEnd = () => {
    if (!drag) return;

    const { data, node } = drag;
    // Hitung di posisi akhir pointer agar tidak tertinggal satu frame
    const drop = resolveTarget(pointer.x, pointer.y, node)?.drop;
    stop();
    if (!drop) return;

    const { content, setContent, setSelected } = latest.current;

    if (data.kind === 'new') {
      const component = createComponent(data.group, data.type);
      const next = insertComponent(content, component, drop);
      if (!next) return;

      setContent(next);
      setSelected(component);
      return;
    }

    const next = moveComponent(content, data.id, drop);
    if (next !== content) setContent(next);

    // Komponen yang di-drop langsung dipilih. Ambil dari `next` karena
    // container yang dilalui perpindahan di-copy (referensi baru).
    setSelected(findComponent(next, data.id));
  };

  return { onDragCancel: stop, onDragEnd, onDragStart, stop };
};

/**
 * Drag & drop view builder. Komponen di canvas (ComponentFrame) dan item
 * di panel Component menjadi sumber drag; area drop ditandai dengan
 * atribut `data-dnd-section` oleh interpreter.
 *
 * Selama drag tidak ada state React yang berubah: chip, garis indikator,
 * dan auto-scroll diperbarui langsung ke DOM per animation frame.
 * `content` hanya diubah sekali saat drop.
 */
const BuilderDnd = (props) => {
  const { children, content, setContent, setSelected } = props;

  const sensors = useSensors(
    useSensor(BuilderPointerSensor, {
      activationConstraint: { distance: DRAG_DISTANCE },
    }),
  );

  const latest = useRef(null);
  latest.current = { content, setContent, setSelected };

  const chip = useRef(null);
  const chipLabel = useRef(null);
  const highlight = useRef(null);
  const line = useRef(null);

  const engine = useMemo(
    () => createDragEngine({ chip, chipLabel, highlight, line, latest }),
    [],
  );

  useEffect(() => engine.stop, []);

  const actions = useMemo(
    () => ({
      updateComponent: (id, updater) => {
        const { content, setContent, setSelected } = latest.current;
        const next = updateComponent(content, id, updater);
        if (next === content) return;

        setContent(next);
        // Panel Properties membaca dan mengedit dari objek `selected`;
        // segarkan referensinya agar edit berikutnya tidak memakai versi lama
        setSelected((prev) => (prev && findComponent(next, prev.id)) || prev);
      },
    }),
    [],
  );

  return (
    <DndContext
      autoScroll={false}
      sensors={sensors}
      onDragStart={engine.onDragStart}
      onDragEnd={engine.onDragEnd}
      onDragCancel={engine.onDragCancel}
    >
      <BuilderActionsContext.Provider value={actions}>
        {children}
      </BuilderActionsContext.Provider>
      <Box
        ref={highlight}
        sx={{
          ...overlaySx,
          backgroundColor: 'primary.main',
          borderRadius: 1,
          opacity: 0.06,
        }}
      />
      <Box
        ref={line}
        sx={{ ...overlaySx, backgroundColor: 'primary.main', borderRadius: 1 }}
      />
      <Box
        ref={chip}
        sx={{
          ...overlaySx,
          alignItems: 'center',
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1,
          boxShadow: 3,
          color: 'primary.main',
          gap: 0.5,
          px: 1,
          py: 0.5,
          typography: 'body2',
          whiteSpace: 'nowrap',
        }}
      >
        <DragIndicator fontSize="small" />
        <span ref={chipLabel} />
      </Box>
    </DndContext>
  );
};

export default BuilderDnd;
