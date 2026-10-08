import { createFormData } from '@/hooks/FormData';
import { createParameter } from '@/hooks/Parameter';
import { createUIStore } from '@/hooks/UIStore';

/**
 * Diekspos ke script user sebagai `zcore`.
 *
 * Aksi (alert, loader, redirect, ...) dibuat sekali di runtime. Bagian
 * yang membaca state (formData, uiStore, parameter) dibuat per `read`
 * agar ScriptEngine tahu nilai apa saja yang dipakai sebuah komponen.
 */
const CoreContext = (runtime, read) => {
  const { actions, stores } = runtime;

  return {
    ...actions,
    formData: createFormData(stores.formData, read),
    parameter: createParameter(stores.parameter, read),
    uiStore: createUIStore(stores.uiStore, read),
  };
};

export default CoreContext;
