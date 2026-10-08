import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();
// Setter dipisah agar komponen yang hanya menampilkan alert tidak ikut
// re-render setiap kali alert berubah
const SetAlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  return (
    <SetAlertContext.Provider value={setAlert}>
      <AlertContext.Provider value={{ alert, setAlert }}>
        {children}
      </AlertContext.Provider>
    </SetAlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};

export const useSetAlert = () => {
  const context = useContext(SetAlertContext);
  if (!context) {
    throw new Error('useSetAlert must be used within a AlertProvider');
  }
  return context;
};
