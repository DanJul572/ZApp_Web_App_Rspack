import { QueryObserver } from '@tanstack/react-query';
import { useEffect, useReducer, useRef } from 'react';
import CoreContext from './context/CoreContext';
import QueryContext from './context/QueryContext';
import ReportContext from './context/ReportContext';
import createReadTracker from './readTracker';
import { scriptQueryKey, useScriptRuntime } from './ScriptRuntime';
import runInSandbox from './sandbox';
import { toExpressionScript } from './scriptSyntax';

/**
 * Samakan QueryObserver milik komponen dengan zquery yang dibaca di
 * render terakhir. Observer disimpan antar render agar query tidak
 * di-fetch ulang setiap kali komponen re-render.
 */
const syncQueryObservers = (observers, queryIds, runtime, onChange) => {
  for (const [scriptId, unsubscribe] of observers) {
    if (!queryIds.has(scriptId)) {
      unsubscribe();
      observers.delete(scriptId);
    }
  }

  for (const scriptId of queryIds) {
    if (observers.has(scriptId)) continue;

    const observer = new QueryObserver(runtime.queryClient, {
      queryKey: scriptQueryKey(scriptId),
      queryFn: () => runtime.fetchScript(scriptId),
      enabled: Boolean(scriptId),
      retry: 0,
    });
    observers.set(scriptId, observer.subscribe(onChange));
  }
};

const clearQueryObservers = (observers) => {
  for (const unsubscribe of observers.values()) unsubscribe();
  observers.clear();
};

/**
 * Menjalankan script & expression milik user yang tersimpan di konfigurasi view.
 *
 * Jumlah hook selalu tetap, apa pun isi expression-nya. Selama render,
 * nilai yang dibaca expression (formData, uiStore, parameter, zquery,
 * zreport.loading) dicatat; setelah commit komponen subscribe ke nilai
 * tersebut dan hanya re-render jika ada yang berubah.
 *
 * Nama variabel di sandbox (zcore, zbuilder, zquery, zreport, param) adalah
 * API publik yang dipakai script user — jangan diubah. Jika menambah
 * variabel, perbarui juga SCRIPT_VARIABLES di scriptSyntax.js dan
 * apiCatalog.js.
 */
const ScriptEngine = ({ isBuilder } = {}) => {
  const runtime = useScriptRuntime();
  const [, forceRender] = useReducer((count) => count + 1, 0);
  const observers = useRef(new Map());
  const checkStale = useRef(null);

  // Catatan pembacaan baru untuk setiap render
  const tracker = createReadTracker();

  let trackedContext = null;
  const getTrackedContext = () => {
    if (!trackedContext) {
      trackedContext = {
        zcore: CoreContext(runtime, tracker.read),
        zbuilder: runtime.zbuilder,
        zquery: QueryContext({
          isBuilder,
          readQuery: (scriptId) => {
            const queryKey = scriptQueryKey(scriptId);
            return tracker.readQuery(scriptId, {
              getState: () => runtime.queryClient.getQueryData(queryKey),
            });
          },
        }),
        zreport: ReportContext(runtime, tracker.read),
        console, // opsional, expose console ke user
      };
    }
    return trackedContext;
  };

  // Script aksi berjalan di luar render: tidak perlu dicatat, dan zquery
  // hanya membaca hasil yang sudah ada di cache
  const actionContext = () => ({
    zcore: runtime.zcore,
    zbuilder: runtime.zbuilder,
    zquery: QueryContext({
      isBuilder,
      readQuery: (scriptId) =>
        runtime.queryClient.getQueryData(scriptQueryKey(scriptId))?.data,
    }),
    zreport: runtime.zreport,
    console,
  });

  useEffect(() => {
    checkStale.current = () => {
      if (tracker.isStale()) forceRender();
    };
    const onChange = () => checkStale.current?.();

    const unsubscribes = [...tracker.subscribableStores()].map((store) =>
      store.subscribe(onChange),
    );
    syncQueryObservers(observers.current, tracker.queryIds, runtime, onChange);

    // Nilai bisa berubah di antara render dan subscribe
    onChange();

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  });

  useEffect(() => () => clearQueryObservers(observers.current), []);

  /**
   * Jalankan script aksi (onClick, onLoad, ...).
   * `param` bisa diakses dari script, mis. `param.row` pada aksi tabel.
   */
  const execute = (script, param = null) => {
    try {
      runInSandbox(script, { ...actionContext(), param });
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

      let code = property;
      if (typeof property === 'object') {
        if (!property.isBind) return property.value;
        if (!property.value) return null;
        code = property.value;
      }

      return runInSandbox(toExpressionScript(code), {
        ...getTrackedContext(),
        param,
      });
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  /**
   * Uji expression dari editor builder. Dipanggil di luar render, jadi
   * `zquery` diganti stub yang selalu null.
   * Error dilempar apa adanya agar bisa ditampilkan ke user.
   */
  const test = (code, param = null) => {
    return runInSandbox(toExpressionScript(code), {
      ...actionContext(),
      zquery: () => null,
      param,
    });
  };

  return {
    evaluate,
    execute,
    test,
    // `zcore` yang dicatat, untuk renderer yang membaca form data langsung
    get zcore() {
      return getTrackedContext().zcore;
    },
  };
};

export default ScriptEngine;
