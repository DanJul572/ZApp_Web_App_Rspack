import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import 'suneditor/dist/css/suneditor.min.css';
import 'react-querybuilder/dist/query-builder.css';

import { AlertProvider } from '@/context/AlertProvider';
import { ComponentProvider } from '@/context/ComponentProvider';
import ErrorProvider from '@/context/ErrorProvider';
import { ExpandedMenuProvider } from '@/context/ExpandedMenuProvider';
import { FileProvider } from '@/context/FileProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
import { ToastProvider } from '@/context/ToastProvider';
import { VarsProvider } from '@/context/VarsProvider';

const queryClient = new QueryClient();

export const metadata = {
  title: 'ZApp',
  description: 'Cretae your app without code',
};

export default function Layout({ children }) {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          <LoadingProvider>
            <AlertProvider>
              <ToastProvider>
                <VarsProvider>
                  <FileProvider>
                    <ComponentProvider>
                      <ExpandedMenuProvider>{children}</ExpandedMenuProvider>
                    </ComponentProvider>
                  </FileProvider>
                </VarsProvider>
              </ToastProvider>
            </AlertProvider>
          </LoadingProvider>
        </ErrorProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
