import { useMemo } from 'react';
import { useUIStoreStore } from '@/contexts/UIStoreProvider';
import { readState } from '@/helpers/createStore';

/** API UI store di atas store. Lihat createFormData untuk `read`. */
export const createUIStore = (store, read = readState) => ({
  get: (name) => read(store, (state) => (state ? state[name] : null)),
  removeAll: () => store.setState(null),
  set: (name, value) =>
    store.setState((state) => ({ ...state, [name]: value })),
  setAll: (obj) => store.setState(obj),
});

/** Tidak reaktif: tidak me-render ulang komponen saat UI store berubah. */
const UIStore = () => {
  const store = useUIStoreStore();
  return useMemo(() => createUIStore(store), [store]);
};

export default UIStore;
