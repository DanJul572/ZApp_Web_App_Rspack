import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';

import { AlertProvider } from '@/contexts/AlertProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { ExpandedMenuProvider } from '@/contexts/ExpandedMenuProvider';
import { FileProvider } from '@/contexts/FileProvider';
import { FormDataProvider } from '@/contexts/FormDataProvider';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { ToastProvider } from '@/contexts/ToastProvider';
import { UIStoreProvider } from '@/contexts/UIStoreProvider';
import { version } from '../../package.json';

const queryClient = new QueryClient();

export default function Layout({ children }) {
  const { config } = useConfig();

  useEffect(() => {
    if (config?.app.name) {
      document.title = `${config.app.name} v${version}`;
    }
  }, [config]);

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <AlertProvider>
            <ToastProvider>
              <FormDataProvider>
                <FileProvider>
                  <UIStoreProvider>
                    <ExpandedMenuProvider>{children}</ExpandedMenuProvider>
                  </UIStoreProvider>
                </FileProvider>
              </FormDataProvider>
            </ToastProvider>
          </AlertProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
