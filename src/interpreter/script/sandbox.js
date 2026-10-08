// Fungsi hasil compile per (nama variabel + kode). Expression property
// dievaluasi di setiap render, jadi compile ulang dengan new Function()
// setiap kali jauh lebih mahal daripada menjalankannya.
const compiled = new Map();

const compile = (contextKeys, code) => {
  const cacheKey = `${contextKeys.join(',')}\n${code}`;
  let fn = compiled.get(cacheKey);
  if (!fn) {
    fn = new Function(...contextKeys, `"use strict";\n${code}`);
    compiled.set(cacheKey, fn);
  }
  return fn;
};

/**
 * Jalankan potongan kode user di dalam fungsi terisolasi.
 * new Function() tidak bisa akses variabel lokal — lebih aman dari eval.
 * Context di-inject sebagai parameter, bukan via closure.
 */
const runInSandbox = (code, context = {}) => {
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);

  return compile(contextKeys, code)(...contextValues);
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
