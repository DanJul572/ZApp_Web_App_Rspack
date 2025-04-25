import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layout/Empty';
import MainLayout from '@/layout/Main';

import LoginPage from '@/page/login/page';
import ModulePage from '@/page/module/page';
import WelcomePage from '@/page/page';

const routes = createBrowserRouter([
  {
    path: '/',
    Component: () => (
      <EmptyLayout>
        <WelcomePage />
      </EmptyLayout>
    ),
  },
  {
    path: '/login',
    Component: () => (
      <EmptyLayout>
        <LoginPage />
      </EmptyLayout>
    ),
  },
  {
    path: '/module',
    Component: () => (
      <MainLayout>
        <ModulePage />
      </MainLayout>
    ),
  },
]);

export default routes;
