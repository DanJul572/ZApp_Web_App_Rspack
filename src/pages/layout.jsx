import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import 'suneditor/dist/css/suneditor.min.css';

import { AlertProvider } from '@/contextss/AlertProvider';
import { ExpandedMenuProvider } from '@/contextss/ExpandedMenuProvider';
import { FileProvider } from '@/contextss/FileProvider';
import { FormDataProvider } from '@/contextss/FormDataProvider';
import { LoadingProvider } from '@/contextss/LoadingProvider';
import { ToastProvider } from '@/contextss/ToastProvider';
import { UIStoreProvider } from '@/contextss/UIStoreProvider';

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
