import { createContext, useContext, useState } from 'react';
import createStore from '@/helpers/createStore';

const FormDataContext = createContext();

/**
 * Value context adalah store (referensinya tetap), bukan isi form.
 * Komponen yang perlu isi form subscribe ke store agar hanya re-render
 * jika field yang dibacanya berubah (lihat hooks/FormData).
 */
export const FormDataProvider = ({ children }) => {
  const [store] = useState(() => createStore({}));

  return (
    <FormDataContext.Provider value={store}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormDataStore = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormDataStore must be used within a FormDataProvider');
  }
  return context;
};
