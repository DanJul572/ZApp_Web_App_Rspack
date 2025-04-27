import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layout/Empty';
import MainLayout from '@/layout/Main';

import LoginPage from '@/page/login/page';
import MainPage from '@/page/main/page';
import CreateMenuPage from '@/page/menu/create/page';
import MenuPage from '@/page/menu/page';
import CreateModulePage from '@/page/module/create/page';
import ModulePage from '@/page/module/page';
import WelcomePage from '@/page/page';
import CreateViewPage from '@/page/view/create/page';
import ViewPage from '@/page/view/page';

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
  {
    path: '/module/create',
    Component: () => (
      <MainLayout>
        <CreateModulePage />
      </MainLayout>
    ),
  },
  {
    path: '/menu',
    Component: () => (
      <MainLayout>
        <MenuPage />
      </MainLayout>
    ),
  },
  {
    path: '/menu/create',
    Component: () => (
      <MainLayout>
        <CreateMenuPage />
      </MainLayout>
    ),
  },
  {
    path: '/view',
    Component: () => (
      <MainLayout>
        <ViewPage />
      </MainLayout>
    ),
  },
  {
    path: '/view/create',
    Component: () => (
      <EmptyLayout>
        <CreateViewPage />
      </EmptyLayout>
    ),
  },
  {
    path: '/:id',
    Component: () => (
      <EmptyLayout>
        <MainPage />
      </EmptyLayout>
    ),
  },
]);

export default routes;
