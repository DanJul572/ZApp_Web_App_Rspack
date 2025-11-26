import jsreport from '@jsreport/browser-client';
import { createContext, useContext } from 'react';
import { useConfig } from './ConfigProvider';

const JSReportContext = createContext();

export const JSReportProvider = ({ children }) => {
  const { config } = useConfig();

  const url = config.report.jsreport.url;
  const user = process.env.REACT_APP_JSREPORT_USER;
  const password = process.env.REACT_APP_JSREPORT_PASSWORD;

  const download = async (name, template, data = {}) => {
    jsreport.serverUrl = url;
    jsreport.headers.Authorization = `Basic ${btoa(`${user}:${password}`)}`;
    const report = await jsreport.render({
      template: {
        name: template,
      },
      data: data,
    });
    report.download(name);
  };

  const open = async (name, template, data = {}) => {
    jsreport.serverUrl = config.report.jsreport.url;
    jsreport.headers.Authorization = `Basic ${btoa(`${user}:${password}`)}`;
    const report = await jsreport.render({
      template: {
        name: template,
      },
      data: data,
    });
    report.openInWindow(name);
  };

  return (
    <JSReportContext.Provider value={{ download, open }}>
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
