import { createContext, useContext, useState } from 'react';

const UIStoreContext = createContext();

export const UIStoreProvider = ({ children }) => {
  const [store, setStore] = useState({});

  return (
    <UIStoreContext.Provider value={{ store, setStore }}>
      {children}
    </UIStoreContext.Provider>
  );
};

export const useUIStore = () => {
  const context = useContext(UIStoreContext);
  if (!context) {
    throw new Error('useUIStore must be used within a UIStoreProvider');
  }
  return context;
};
