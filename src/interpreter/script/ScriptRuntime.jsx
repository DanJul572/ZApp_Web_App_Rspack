import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSetAlert } from '@/contexts/AlertProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { useFile } from '@/contexts/FileProvider';
import { useFormDataStore } from '@/contexts/FormDataProvider';
import { useJSReport } from '@/contexts/JSReport';
import { useSetLoading } from '@/contexts/LoadingProvider';
import { useSetToast } from '@/contexts/ToastProvider';
import { useUIStoreStore } from '@/contexts/UIStoreProvider';
import createStore, { readState } from '@/helpers/createStore';
import { createAlert } from '@/hooks/Alert';
import { createLoader } from '@/hooks/Loader';
import { createRedirect } from '@/hooks/Redirect';
import Request from '@/hooks/Request';
import { createToaster } from '@/hooks/Toaster';
import Translator from '@/hooks/Translator';
import BuilderContext from './context/BuilderContext';
import CoreContext from './context/CoreContext';
import ReportContext from './context/ReportContext';

const ScriptRuntimeContext = createContext(null);

export const scriptQueryKey = (scriptId) => ['script-run', scriptId];

/**
 * Objek runtime yang dibagi semua komponen interpreter. Semua fungsi
 * membaca nilai terbaru dari `latest`, jadi referensinya tidak pernah
 * berubah dan komponen tidak ikut re-render saat alert, loading, file,
 * dan lainnya berubah.
 */
const createRuntime = ({ latest, queryClient, stores }) => {
  const runtime = { latest, queryClient, stores };

  runtime.actions = {
    alert: createAlert((value) => latest.current.setAlert(value)),
    loader: createLoader((value) => latest.current.setLoading(value)),
    redirect: createRedirect((...args) => latest.current.navigate(...args)),
    toaster: createToaster((value) => latest.current.setToast(value)),
    translator: (key) => latest.current.translator(key),
  };

  // Context untuk script aksi: tidak mencatat pembacaan
  runtime.zcore = CoreContext(runtime, readState);
  runtime.zbuilder = BuilderContext({ zcore: runtime.zcore, latest });
  runtime.zreport = ReportContext(runtime, readState);

  runtime.fetchScript = (scriptId) => {
    const { config, request } = latest.current;
    return request.get(config.api.script.run, { id: scriptId });
  };

  return runtime;
};

/**
 * Menyediakan runtime script untuk seluruh aplikasi. Hook React hanya
 * dipanggil di sini (sekali), bukan di setiap komponen yang dirender
 * interpreter.
 */
export const ScriptRuntimeProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const formData = useFormDataStore();
  const uiStore = useUIStoreStore();
  const setAlert = useSetAlert();
  const setLoading = useSetLoading();
  const setToast = useSetToast();
  const { file, setFile } = useFile();
  const { config } = useConfig();
  const navigate = useNavigate();
  const request = Request();
  const report = useJSReport();
  const translator = Translator();
  const [searchParams] = useSearchParams();

  const latest = useRef(null);
  latest.current = {
    config,
    file,
    navigate,
    report,
    request,
    setAlert,
    setFile,
    setLoading,
    setToast,
    translator,
  };

  const [runtime] = useState(() =>
    createRuntime({
      latest,
      queryClient,
      stores: {
        formData,
        parameter: createStore(searchParams),
        report: createStore(report.loading),
        uiStore,
      },
    }),
  );

  useLayoutEffect(() => {
    runtime.stores.parameter.setState(searchParams);
  }, [searchParams]);

  useLayoutEffect(() => {
    runtime.stores.report.setState(report.loading);
  }, [report.loading]);

  return (
    <ScriptRuntimeContext.Provider value={runtime}>
      {children}
    </ScriptRuntimeContext.Provider>
  );
};

export const useScriptRuntime = () => {
  const context = useContext(ScriptRuntimeContext);
  if (!context) {
    throw new Error(
      'useScriptRuntime must be used within a ScriptRuntimeProvider',
    );
  }
  return context;
};
