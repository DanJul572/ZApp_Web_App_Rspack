import { useMemo } from 'react';
import { useFormDataStore } from '@/contexts/FormDataProvider';
import { readState } from '@/helpers/createStore';

/**
 * API form data di atas store. `read` dipakai untuk semua pembacaan agar
 * ScriptEngine bisa mencatat field yang dibaca saat render.
 */
export const createFormData = (store, read = readState) => ({
  get: (name) => {
    const value = read(store, (formData) => formData?.[name]);
    return value ? value : null;
  },
  getAll: () => read(store, (formData) => formData),
  removeAll: () => store.setState(null),
  // Pakai state terbaru, bukan snapshot saat render, agar beberapa set()
  // berturut-turut dalam satu script tidak saling menimpa
  set: (name, value) =>
    store.setState((formData) => ({ ...formData, [name]: value })),
  setAll: (obj) => store.setState(obj),
});

/** Tidak reaktif: tidak me-render ulang komponen saat form data berubah. */
const FormData = () => {
  const store = useFormDataStore();
  return useMemo(() => createFormData(store), [store]);
};

export default FormData;
