import { createContext, useContext, useState } from 'react';
import { downloadFileFromBuffer } from '@/helpers/downloadFile';
import Request from '@/hooks/Request';
import { useConfig } from './ConfigProvider';

const JSReportContext = createContext();

// Reports are rendered by the API, which returns the file. The browser never talks to jsreport.
export const JSReportProvider = ({ children }) => {
  const { config } = useConfig();
  const { postFile } = Request();

  const [loading, setLoading] = useState(false);

  const render = async (template, data) => {
    setLoading(true);
    try {
      return await postFile(config.api.report.render, { template, data });
    } finally {
      setLoading(false);
    }
  };

  const download = async (name, template, data = {}) => {
    const report = await render(template, data);
    downloadFileFromBuffer(report, name, report.type);
  };

  const open = async (name, template, data = {}) => {
    const report = await render(template, data);
    const url = URL.createObjectURL(report);

    // An iframe in a new window keeps `name` as the window title.
    const reportWindow = window.open();
    if (!reportWindow) {
      URL.revokeObjectURL(url);
      return;
    }

    reportWindow.document.title = name;
    reportWindow.document.body.style.margin = '0';

    const frame = reportWindow.document.createElement('iframe');
    frame.src = url;
    frame.style.cssText = 'border: 0; width: 100vw; height: 100vh;';
    reportWindow.document.body.appendChild(frame);

    reportWindow.addEventListener('beforeunload', () =>
      URL.revokeObjectURL(url),
    );
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
