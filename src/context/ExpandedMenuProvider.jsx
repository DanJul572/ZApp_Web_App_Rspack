import { createContext, useContext, useState } from 'react';

const ExpandedMenuContext = createContext();

export const ExpandedMenuProvider = ({ children }) => {
  const [expandedMenu, setExpandedMenu] = useState([]);

  return (
    <ExpandedMenuContext.Provider value={{ expandedMenu, setExpandedMenu }}>
      {children}
    </ExpandedMenuContext.Provider>
  );
};

export const useExpandedMenu = () => {
  const context = useContext(ExpandedMenuContext);
  if (!context) {
    throw new Error(
      'useExpandedMenu must be used within a ExpandedMenuProvider',
    );
  }
  return context;
};
