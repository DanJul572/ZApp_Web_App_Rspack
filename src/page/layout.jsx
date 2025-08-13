import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import 'suneditor/dist/css/suneditor.min.css';

import { AlertProvider } from '@/context/AlertProvider';
import { ComponentProvider } from '@/context/ComponentProvider';
import { ExpandedMenuProvider } from '@/context/ExpandedMenuProvider';
import { FileProvider } from '@/context/FileProvider';
import { FormDataProvider } from '@/context/FormDataProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
import { ToastProvider } from '@/context/ToastProvider';

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
                  <ComponentProvider>
                    <ExpandedMenuProvider>{children}</ExpandedMenuProvider>
                  </ComponentProvider>
                </FileProvider>
              </FormDataProvider>
            </ToastProvider>
          </AlertProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
