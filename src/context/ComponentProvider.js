import { createContext, useContext, useState } from 'react';

const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
  const [comp, setComp] = useState({});

  return (
    <ComponentContext.Provider value={{ comp, setComp }}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponent = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('useComponent must be used within a ComponentProvider');
  }
  return context;
};
