import BuilderContext from './context/BuilderContext';
import CoreContext from './context/CoreContext';
import QueryContext from './context/QueryContext';
import ReportContext from './context/ReportContext';
import runInSandbox from './sandbox';
import { toExpressionScript } from './scriptSyntax';

/**
 * Menjalankan script & expression milik user yang tersimpan di konfigurasi view.
 *
 * Nama variabel di sandbox (zcore, zbuilder, zquery, zreport, param) adalah
 * API publik yang dipakai script user — jangan diubah. Jika menambah
 * variabel, perbarui juga SCRIPT_VARIABLES di scriptSyntax.js dan
 * apiCatalog.js.
 */
const ScriptEngine = ({ isBuilder } = {}) => {
  const zcore = CoreContext();
  const zbuilder = BuilderContext();
  const zquery = QueryContext({ isBuilder });
  const zreport = ReportContext();

  const sandboxContext = {
    zcore,
    zbuilder,
    zquery,
    zreport,
    console, // opsional, expose console ke user
  };

  const run = (code, param) => {
    return runInSandbox(code, { ...sandboxContext, param });
  };

  /**
   * Jalankan script aksi (onClick, onLoad, ...).
   * `param` bisa diakses dari script, mis. `param.row` pada aksi tabel.
   */
  const execute = (script, param = null) => {
    try {
      run(script, param);
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  /**
   * Ambil nilai property komponen.
   * - { isBind: false, value } → value apa adanya
   * - { isBind: true, value }  → value dievaluasi sebagai expression
   * - selain object            → dievaluasi sebagai expression
   * `param` bisa diakses dari expression, mis. item saat loop.
   */
  const evaluate = (property, param = null) => {
    try {
      if (!property) return null;

      if (typeof property === 'object') {
        if (!property.isBind) return property.value;
        if (property.value) {
          return run(toExpressionScript(property.value), param);
        }
        return null;
      }

      return run(toExpressionScript(property), param);
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  /**
   * Uji expression dari editor builder. Dipanggil di luar render, jadi
   * `zquery` (yang memanggil hook) diganti stub yang selalu null.
   * Error dilempar apa adanya agar bisa ditampilkan ke user.
   */
  const test = (code, param = null) => {
    return runInSandbox(toExpressionScript(code), {
      ...sandboxContext,
      zquery: () => null,
      param,
    });
  };

  return { execute, evaluate, test };
};

export default ScriptEngine;
