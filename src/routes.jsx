import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layoutss/Empty';
import MainLayout from '@/layoutss/Main';

import WelcomePage from '@/pagess';
import LoginPage from '@/pagess/login';
import MainPage from '@/pagess/main';
import MenuPage from '@/pagess/menu';
import CreateMenuPage from '@/pagess/menu/create';
import ModulePage from '@/pagess/module';
import CreateModulePage from '@/pagess/module/create';
import RegisterPage from '@/pagess/register';
import ViewPage from '@/pagess/view';
import CreateViewPage from '@/pagess/view/create';

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
