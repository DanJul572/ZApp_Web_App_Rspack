import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();
// Setter dipisah agar komponen yang hanya menampilkan loader tidak ikut
// re-render setiap kali loading berubah
const SetLoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <SetLoadingContext.Provider value={setLoading}>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {children}
      </LoadingContext.Provider>
    </SetLoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const useSetLoading = () => {
  const context = useContext(SetLoadingContext);
  if (!context) {
    throw new Error('useSetLoading must be used within a LoadingProvider');
  }
  return context;
};
