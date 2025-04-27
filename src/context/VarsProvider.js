import { createContext, useContext, useState } from 'react';

const VarsContext = createContext();

export const VarsProvider = ({ children }) => {
  const [vars, setVars] = useState({});

  return (
    <VarsContext.Provider value={{ vars, setVars }}>
      {children}
    </VarsContext.Provider>
  );
};

export const useVars = () => {
  const context = useContext(VarsContext);
  if (!context) {
    throw new Error('useVars must be used within a VarsProvider');
  }
  return context;
};
