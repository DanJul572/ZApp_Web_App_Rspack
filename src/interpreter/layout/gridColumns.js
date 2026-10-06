/**
 * Helper ukuran kolom grid. Ukuran disimpan di `properties.size` sebagai
 * string "4,8" (satuan 12 kolom MUI Grid), anak komponen di `section[i]`.
 */

export const GRID_COLUMNS = 12;

const sum = (sizes) => sizes.reduce((total, size) => total + size, 0);

/**
 * Lebar tiap kolom. Jumlah kolom = terbanyak antara entri `size` dan
 * section, sehingga kolom yang belum berisi tetap muncul sebagai area drop.
 */
export const parseGridSizes = (size, sectionCount = 0, minCount = 0) => {
  const sizes = size
    ? String(size)
        .split(',')
        .map((value) => Number.parseInt(value, 10))
    : [];
  const count = Math.max(sizes.length, sectionCount, minCount);
  const fallback = GRID_COLUMNS / (count || 1);

  return Array.from({ length: count }, (_, i) =>
    sizes[i] > 0 ? Math.min(sizes[i], GRID_COLUMNS) : fallback,
  );
};

export const serializeGridSizes = (sizes) => sizes.join(',');

/**
 * Tambah kolom di akhir. Sisa ruang dipakai jika ada; jika penuh, kolom
 * terlebar (yang paling kanan bila sama) dibagi dua.
 */
export const addGridColumn = (sizes) => {
  const free = GRID_COLUMNS - sum(sizes);
  if (free >= 1) return [...sizes, free];

  let widest = -1;
  sizes.forEach((size, i) => {
    if (widest === -1 || size >= sizes[widest]) widest = i;
  });
  if (widest === -1 || sizes[widest] < 2) return [...sizes, GRID_COLUMNS];

  const half = Math.floor(sizes[widest] / 2);
  return [...sizes.map((size, i) => (i === widest ? size - half : size)), half];
};

/** Hapus kolom; lebarnya diberikan ke kolom tetangga (kiri bila ada). */
export const removeGridColumn = (sizes, index) => {
  if (sizes.length <= 1) return sizes;

  const neighbor = index > 0 ? index - 1 : index + 1;
  const next = sizes.map((size, i) =>
    i === neighbor ? size + sizes[index] : size,
  );
  return next.filter((_, i) => i !== index);
};

/**
 * Geser batas antara kolom `index` dan `index + 1` sebanyak `delta` unit.
 * Total keduanya tetap, masing-masing minimal 1 unit.
 */
export const resizeGridColumns = (sizes, index, delta) => {
  const left = sizes[index];
  const right = sizes[index + 1];
  if (left === undefined || right === undefined) return sizes;

  const clamped = Math.min(Math.max(delta, 1 - left), right - 1);
  if (clamped === 0) return sizes;

  return sizes.map((size, i) => {
    if (i === index) return left + clamped;
    if (i === index + 1) return right - clamped;
    return size;
  });
};
