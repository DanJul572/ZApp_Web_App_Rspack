import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layout/Empty';
import MainLayout from '@/layout/Main';

import WelcomePage from '@/page';
import LoginPage from '@/page/login';
import MainPage from '@/page/main';
import MenuPage from '@/page/menu';
import CreateMenuPage from '@/page/menu/create';
import ModulePage from '@/page/module';
import CreateModulePage from '@/page/module/create';
import ViewPage from '@/page/view';
import CreateViewPage from '@/page/view/create';

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
