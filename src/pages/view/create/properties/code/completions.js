import apiCatalog from '@/interpreter/script/apiCatalog';

/**
 * Autocomplete editor kode builder, dibangun dari apiCatalog dan
 * `spec.params`. Tidak mengimpor CodeMirror agar bisa diuji tanpa editor:
 * `createCompletionSource` hanya memakai `context.matchBefore` / `explicit`.
 */

// Deskripsi untuk node perantara (mis. `zcore.formData`) yang tidak punya
// entri sendiri di katalog
const namespaceInfo = {
  zcore: 'Form, URL parameter, UI store, navigation and feedback',
  'zcore.formData': 'Values of the form fields on this page',
  'zcore.parameter': 'Query string of the current URL',
  'zcore.uiStore': 'Values shared between components on the page',
  'zcore.redirect': 'Navigation',
  'zcore.toaster': 'Toast messages',
  'zcore.alert': 'Alert banner',
  'zcore.loader': 'Full page loader',
  zbuilder: 'Save and load module rows',
  'zbuilder.classicQuery': 'Ready-made form save / load',
  'zbuilder.crud': 'Low level insert, update and detail requests',
  zreport: 'jsreport templates',
  console: 'Browser console',
  param: 'Value passed by the component that runs this code',
};

// `zcore.formData.get('fieldName')` → path `zcore.formData.get`, args `('fieldName')`
const splitCode = (code) => {
  const index = code.search(/[(\s]/);
  if (index === -1) return { path: code, args: '' };
  return { path: code.slice(0, index), args: code.slice(index) };
};

const createNode = () => ({ children: new Map(), entries: [] });

/**
 * Susun pohon path dari katalog + param yang berlaku untuk `spec.kind`.
 * Setiap node menyimpan anak (segmen berikutnya) dan entri katalog yang
 * berakhir tepat di node tersebut.
 */
export const buildCompletionTree = (spec) => {
  const root = createNode();

  const catalogItems = apiCatalog.flatMap((group) =>
    group.items.filter((item) => item.kinds.includes(spec.kind)),
  );

  for (const item of [...spec.params, ...catalogItems]) {
    const { path, args } = splitCode(item.code);
    let node = root;
    for (const segment of path.split('.')) {
      if (!node.children.has(segment)) {
        node.children.set(segment, createNode());
      }
      node = node.children.get(segment);
    }
    node.entries.push({ args, description: item.description });
  }

  return root;
};

const toOptions = (segment, node, fullPath) => {
  const hasChildren = node.children.size > 0;

  // Satu opsi per entri katalog, mis. dua varian zquery
  const entryOptions = node.entries.map((entry) => ({
    label: segment,
    apply: segment + entry.args,
    // Argumen panjang (mis. crud.create) disingkat, isi lengkap tetap disisipkan
    detail: entry.args.length > 30 ? '(…)' : entry.args,
    info: entry.description,
    type: entry.args ? 'function' : 'property',
  }));

  if (entryOptions.length > 0 && !hasChildren) return entryOptions;

  // Node perantara (mis. `zcore`, atau `param` yang punya anak `row`)
  const namespaceOption = {
    label: segment,
    info: namespaceInfo[fullPath] || entryOptions[0]?.info,
    type: fullPath.includes('.') ? 'property' : 'namespace',
  };
  return [namespaceOption];
};

/**
 * Daftar opsi untuk path sebelum titik terakhir (mis. ['zcore', 'formData']).
 * Mengembalikan null jika path tidak dikenal.
 */
export const getCompletionOptions = (tree, parents) => {
  let node = tree;
  for (const segment of parents) {
    node = node.children.get(segment);
    if (!node) return null;
  }

  return [...node.children.entries()].flatMap(([segment, child]) =>
    toOptions(segment, child, [...parents, segment].join('.')),
  );
};

/** Completion source CodeMirror untuk spec property yang sedang diedit. */
export const createCompletionSource = (spec) => {
  const tree = buildCompletionTree(spec);

  return (context) => {
    // Rantai `a.b.c` yang sedang diketik tepat sebelum kursor
    const match = context.matchBefore(/(?:[A-Za-z_$][\w$]*\.)*[\w$]*/);
    if (!match || (match.from === match.to && !context.explicit)) return null;

    // Jangan lanjutkan rantai dari ekspresi lain, mis. `row.name` atau `a().b`
    const charBefore =
      match.from > 0 ? context.state.sliceDoc(match.from - 1, match.from) : '';
    if (charBefore === '.') return null;

    const segments = match.text.split('.');
    const word = segments.pop();
    const options = getCompletionOptions(tree, segments);
    if (!options) return null;

    return {
      from: match.to - word.length,
      options,
      validFor: /^[\w$]*$/,
    };
  };
};
