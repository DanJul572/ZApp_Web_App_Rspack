import { createContext, useContext, useState } from 'react';
import createStore from '@/helpers/createStore';

const UIStoreContext = createContext();

/**
 * Value context adalah store (referensinya tetap), bukan isinya.
 * Lihat hooks/UIStore.
 */
export const UIStoreProvider = ({ children }) => {
  const [store] = useState(() => createStore({}));

  return (
    <UIStoreContext.Provider value={store}>{children}</UIStoreContext.Provider>
  );
};

export const useUIStoreStore = () => {
  const context = useContext(UIStoreContext);
  if (!context) {
    throw new Error('useUIStoreStore must be used within a UIStoreProvider');
  }
  return context;
};
