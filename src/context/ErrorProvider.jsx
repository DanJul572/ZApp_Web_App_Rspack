import { createContext, useState } from 'react';

export const ErrorContext = createContext();

export default function ErrorProvider({ children }) {
  const [errors, setErrors] = useState({});

  const setError = (group, name, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [group]: {
        ...(prevErrors[group] || {}),
        [name]: error,
      },
    }));
  };

  const clearError = (group, name) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[group]?.[name]) {
        delete updatedErrors[group][name];
        if (Object.keys(updatedErrors[group]).length === 0) {
          delete updatedErrors[group];
        }
      }
      return updatedErrors;
    });
  };

  const groupError = (groups) => {
    for (const group of groups) {
      if (errors[group] && Object.keys(errors[group]).length) {
        return true;
      }
    }
    return false;
  };

  return (
    <ErrorContext.Provider value={{ errors, setError, clearError, groupError }}>
      {children}
    </ErrorContext.Provider>
  );
}
