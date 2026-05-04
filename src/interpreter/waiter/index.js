import Builder from '../command/builder';
import Core from '../command/core';
import Query from '../command/query';
import Report from '../command/report';

const Waiter = () => {
  const zcore = Core();
  const zbuilder = Builder();
  const zquery = Query();
  const zreport = Report();

  // Buat sandbox context yang bisa diakses oleh user code
  const sandboxContext = {
    zcore,
    zbuilder,
    zquery,
    zreport,
    console, // opsional, expose console ke user
  };

  /**
   * Buat fungsi dari string dengan context terbatas
   * new Function() tidak bisa akses variabel lokal — lebih aman dari eval
   */
  const createSandboxedFunction = (code, context = {}) => {
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);

    // Inject context sebagai parameter, bukan via closure
    return new Function(...contextKeys, `"use strict";\n${code}`)(
      ...contextValues,
    );
  };

  // biome-ignore lint/correctness/noUnusedFunctionParameters: required for interpreter
  const order = (func, param = null) => {
    try {
      createSandboxedFunction(func, sandboxContext);
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  // biome-ignore lint/correctness/noUnusedFunctionParameters: required for interpreter
  const take = (data, param = null) => {
    try {
      if (!data) return null;

      if (typeof data === 'object') {
        if (!data.isBind) return data.value;
        if (data.value) {
          return createSandboxedFunction(
            `return ${data.value}`,
            sandboxContext,
          );
        }
        return null;
      }

      if (data) {
        return createSandboxedFunction(`return ${data}`, sandboxContext);
      }

      return null;
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  return { order, take };
};

export default Waiter;
