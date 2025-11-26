import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

export const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/config.json`);
      setConfig(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider
      value={{ config, loading, error, reloadConfig: fetchConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ExpandedMenuProvider');
  }
  return context;
};
