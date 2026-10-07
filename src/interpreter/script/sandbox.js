/**
 * Jalankan potongan kode user di dalam fungsi terisolasi.
 * new Function() tidak bisa akses variabel lokal — lebih aman dari eval.
 * Context di-inject sebagai parameter, bukan via closure.
 */
const runInSandbox = (code, context = {}) => {
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);

  return new Function(...contextKeys, `"use strict";\n${code}`)(
    ...contextValues,
  );
};

/**
 * Cek sintaks kode user tanpa menjalankannya.
 * Mengembalikan pesan error, atau null jika valid.
 */
export const checkSyntax = (code, contextKeys = []) => {
  try {
    new Function(...contextKeys, `"use strict";\n${code}`);
    return null;
  } catch (error) {
    return error.message;
  }
};

export default runInSandbox;
