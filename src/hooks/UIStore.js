import { useUIStore } from '@/contexts/UIStoreProvider';

const UIStore = () => {
  const { store, setStore } = useUIStore({});

  const removeAll = () => {
    setStore(null);
  };

  const setAll = (obj) => {
    setStore(obj);
  };

  const set = (name, value) => {
    const newStore = { ...store };
    newStore[name] = value;
    setStore(newStore);
  };

  const get = (name) => {
    return store ? store[name] : null;
  };

  return {
    get,
    removeAll,
    set,
    setAll,
  };
};

export default UIStore;
