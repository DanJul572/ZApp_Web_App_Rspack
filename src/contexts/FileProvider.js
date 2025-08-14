import { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [file, setFile] = useState([]);

  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
