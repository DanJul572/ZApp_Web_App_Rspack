import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import 'suneditor/dist/css/suneditor.min.css';

import { AlertProvider } from '@/context/AlertProvider';
import { ExpandedMenuProvider } from '@/context/ExpandedMenuProvider';
import { FileProvider } from '@/context/FileProvider';
import { FormDataProvider } from '@/context/FormDataProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
import { ToastProvider } from '@/context/ToastProvider';
import { UIStoreProvider } from '@/context/UIStoreProvider';

const queryClient = new QueryClient();

export const metadata = {
  title: 'ZApp',
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
