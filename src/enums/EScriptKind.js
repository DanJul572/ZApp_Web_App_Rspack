/**
 * Jenis kode user di property view builder.
 * - expression → satu nilai, dievaluasi saat render (Label, Hidden, ...)
 * - action     → script aksi yang dijalankan saat event (On Click, On Load)
 */
const EScriptKind = {
  expression: {
    value: 'expression',
    label: 'Expression',
  },
  action: {
    value: 'action',
    label: 'Action script',
  },
};

export default EScriptKind;
