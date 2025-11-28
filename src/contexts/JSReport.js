import jsreport from '@jsreport/browser-client';
import { createContext, useContext, useState } from 'react';
import { useConfig } from './ConfigProvider';

const JSReportContext = createContext();

export const JSReportProvider = ({ children }) => {
  const { config } = useConfig();

  const [loading, setLoading] = useState(false);

  const url = config?.report?.jsreport?.url;
  const user = process.env.REACT_APP_JSREPORT_USER;
  const password = process.env.REACT_APP_JSREPORT_PASSWORD;

  const download = async (name, template, data = {}) => {
    setLoading(true);
    jsreport.serverUrl = url;
    jsreport.headers.Authorization = `Basic ${btoa(`${user}:${password}`)}`;
    const report = await jsreport.render({
      template: {
        name: template,
      },
      data: data,
    });
    report.download(name);
    setLoading(false);
  };

  const open = async (name, template, data = {}) => {
    setLoading(true);
    jsreport.serverUrl = config.report.jsreport.url;
    jsreport.headers.Authorization = `Basic ${btoa(`${user}:${password}`)}`;
    const report = await jsreport.render({
      template: {
        name: template,
      },
      data: data,
    });
    report.openInWindow(name);
    setLoading(false);
  };

  return (
    <JSReportContext.Provider value={{ download, open, loading }}>
      {children}
    </JSReportContext.Provider>
  );
};

export const useJSReport = () => {
  const context = useContext(JSReportContext);
  if (!context) {
    throw new Error('useJSReport must be used within a JSReportProvider');
  }
  return context;
};
