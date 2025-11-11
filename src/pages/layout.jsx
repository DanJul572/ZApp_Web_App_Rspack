import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import { AlertProvider } from '@/contexts/AlertProvider';
import { ConfigProvider } from '@/contexts/ConfigProvider';
import { ExpandedMenuProvider } from '@/contexts/ExpandedMenuProvider';
import { FileProvider } from '@/contexts/FileProvider';
import { FormDataProvider } from '@/contexts/FormDataProvider';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { ToastProvider } from '@/contexts/ToastProvider';
import { UIStoreProvider } from '@/contexts/UIStoreProvider';

const queryClient = new QueryClient();

export const metadata = {
  title: process.env.REACT_APP_APP_NAME || 'ZApp',
  description: 'Cretae your app without code',
};

export default function Layout({ children }) {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <AlertProvider>
            <ToastProvider>
              <FormDataProvider>
                <FileProvider>
                  <UIStoreProvider>
                    <ConfigProvider>
                      <ExpandedMenuProvider>{children}</ExpandedMenuProvider>
                    </ConfigProvider>
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
