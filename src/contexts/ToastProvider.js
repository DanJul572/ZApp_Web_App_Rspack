import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();
// Setter dipisah agar komponen yang hanya menampilkan toast tidak ikut
// re-render setiap kali toast berubah
const SetToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  return (
    <SetToastContext.Provider value={setToast}>
      <ToastContext.Provider value={{ toast, setToast }}>
        {children}
      </ToastContext.Provider>
    </SetToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const useSetToast = () => {
  const context = useContext(SetToastContext);
  if (!context) {
    throw new Error('useSetToast must be used within a ToastProvider');
  }
  return context;
};
