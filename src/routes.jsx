import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layouts/Empty';
import MainLayout from '@/layouts/Main';

import WelcomePage from '@/pages';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import MenuPage from '@/pages/menu';
import CreateMenuPage from '@/pages/menu/create';
import ModulePage from '@/pages/module';
import CreateModulePage from '@/pages/module/create';
import RegisterPage from '@/pages/register';
import ViewPage from '@/pages/view';
import CreateViewPage from '@/pages/view/create';

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
    path: '/register',
    Component: () => (
      <EmptyLayout>
        <RegisterPage />
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
