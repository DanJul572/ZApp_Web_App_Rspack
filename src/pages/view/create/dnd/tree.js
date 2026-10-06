import { v4 as uuidv4 } from 'uuid';
import EComponentGroupType from '@/enums/EComponentGroupType';

/**
 * Helper immutable untuk pohon `content` view builder.
 * Container menyimpan anaknya di `section[colIndex][index]`. Hanya jalur
 * yang berubah yang di-copy, sehingga komponen lain tetap referensi lama.
 *
 * Target drop berbentuk salah satu dari:
 * - `{ beforeId }` / `{ afterId }`: sisipkan relatif terhadap komponen lain
 * - `{ containerId, colIndex }`: tambahkan di akhir section (null = root)
 */

const hasSection = (component) => Array.isArray(component.section);

const insertAt = (list, index, item) => [
  ...list.slice(0, index),
  item,
  ...list.slice(index),
];

const replaceAt = (list, index, item) =>
  list.map((value, i) => (i === index ? item : value));

const replaceSection = (list, index, colIndex, section) => {
  const component = list[index];
  const sections = [...component.section];
  sections[colIndex] = section;
  return replaceAt(list, index, { ...component, section: sections });
};

export const createComponent = (group, type) => {
  const component = { group, type };

  component.id = uuidv4();
  component.properties = {};

  if (group.value === EComponentGroupType.container.value) {
    component.section = [];
  }

  return component;
};

export const findComponent = (list, id) => {
  for (const component of list) {
    if (component.id === id) return component;
    if (!hasSection(component)) continue;
    for (const section of component.section) {
      const found = findComponent(section, id);
      if (found) return found;
    }
  }
  return null;
};

const containsId = (component, id) =>
  component.id === id ||
  (hasSection(component) &&
    component.section.some((section) =>
      section.some((child) => containsId(child, id)),
    ));

const findLocation = (list, id, containerId = null, colIndex = 0) => {
  for (let i = 0; i < list.length; i++) {
    const component = list[i];
    if (component.id === id) return { containerId, colIndex, index: i };
    if (!hasSection(component)) continue;
    for (let s = 0; s < component.section.length; s++) {
      const location = findLocation(component.section[s], id, component.id, s);
      if (location) return location;
    }
  }
  return null;
};

/**
 * Ganti satu section dengan hasil `updater`. Section yang belum ada
 * (mis. grid tanpa kolom) dibuat kosong terlebih dahulu.
 */
const updateSection = (list, containerId, colIndex, updater) => {
  if (containerId === null) return updater(list);

  for (let i = 0; i < list.length; i++) {
    const component = list[i];
    if (!hasSection(component)) continue;

    if (component.id === containerId) {
      const sections = [...component.section];
      while (sections.length <= colIndex) sections.push([]);
      sections[colIndex] = updater(sections[colIndex]);
      return replaceAt(list, i, { ...component, section: sections });
    }

    for (let s = 0; s < component.section.length; s++) {
      const section = component.section[s];
      const updated = updateSection(section, containerId, colIndex, updater);
      if (updated !== section) return replaceSection(list, i, s, updated);
    }
  }
  return list;
};

/** Ganti komponen `id` dengan hasil `updater`; `list` sama jika tidak ada. */
export const updateComponent = (list, id, updater) => {
  for (let i = 0; i < list.length; i++) {
    const component = list[i];
    if (component.id === id) return replaceAt(list, i, updater(component));
    if (!hasSection(component)) continue;

    for (let s = 0; s < component.section.length; s++) {
      const section = component.section[s];
      const updated = updateComponent(section, id, updater);
      if (updated !== section) return replaceSection(list, i, s, updated);
    }
  }
  return list;
};

const removeComponent = (list, id) => {
  const index = list.findIndex((component) => component.id === id);
  if (index !== -1) {
    return {
      list: [...list.slice(0, index), ...list.slice(index + 1)],
      removed: list[index],
    };
  }

  for (let i = 0; i < list.length; i++) {
    const component = list[i];
    if (!hasSection(component)) continue;
    for (let s = 0; s < component.section.length; s++) {
      const result = removeComponent(component.section[s], id);
      if (result.removed) {
        return {
          list: replaceSection(list, i, s, result.list),
          removed: result.removed,
        };
      }
    }
  }
  return { list, removed: null };
};

/** Mengembalikan content baru, atau null jika target tidak ditemukan. */
export const insertComponent = (list, component, target) => {
  const refId = target.beforeId ?? target.afterId;
  let next;

  if (refId) {
    const location = findLocation(list, refId);
    if (!location) return null;
    const index = location.index + (target.afterId ? 1 : 0);
    next = updateSection(
      list,
      location.containerId,
      location.colIndex,
      (section) => insertAt(section, index, component),
    );
  } else {
    next = updateSection(
      list,
      target.containerId ?? null,
      target.colIndex ?? 0,
      (section) => [...section, component],
    );
  }

  return next === list ? null : next;
};

/** Mengembalikan `list` yang sama jika perpindahan tidak valid / no-op. */
export const moveComponent = (list, id, target) => {
  const refId = target.beforeId ?? target.afterId;
  if (refId === id) return list;

  const source = findComponent(list, id);
  if (!source) return list;

  // Container tidak boleh dipindah ke dalam dirinya sendiri / turunannya
  if (refId && containsId(source, refId)) return list;
  if (target.containerId && containsId(source, target.containerId)) {
    return list;
  }

  const { list: rest, removed } = removeComponent(list, id);
  return insertComponent(rest, removed, target) ?? list;
};
