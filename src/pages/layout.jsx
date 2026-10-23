import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';

import { AlertProvider } from '@/contexts/AlertProvider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { ExpandedMenuProvider } from '@/contexts/ExpandedMenuProvider';
import { FormDataProvider } from '@/contexts/FormDataProvider';
import { JSReportProvider } from '@/contexts/JSReport';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { ToastProvider } from '@/contexts/ToastProvider';
import { UIStoreProvider } from '@/contexts/UIStoreProvider';
import { UserDataProvider } from '@/contexts/UserDataProvider';
import { ScriptRuntimeProvider } from '@/interpreter/script/ScriptRuntime';
import { version } from '../../package.json';

const queryClient = new QueryClient();

export default function Layout() {
  const { config } = useConfig();

  useEffect(() => {
    if (config?.app.name) {
      document.title = `${config.app.name} v${version}`;
    }
  }, [config]);

  if (!config) {
    return;
  }

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          <LoadingProvider>
            <AlertProvider>
              <ToastProvider>
                <FormDataProvider>
                  <UIStoreProvider>
                    <JSReportProvider>
                      <AuthProvider>
                        <ExpandedMenuProvider>
                          <ScriptRuntimeProvider>
                            <Outlet />
                          </ScriptRuntimeProvider>
                        </ExpandedMenuProvider>
                      </AuthProvider>
                    </JSReportProvider>
                  </UIStoreProvider>
                </FormDataProvider>
              </ToastProvider>
            </AlertProvider>
          </LoadingProvider>
        </UserDataProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
