import { createBrowserRouter } from 'react-router';
import AuthenticatedGuard from '@/guards/AuthenticatedGuard';
import NonAuthenticatedGuard from '@/guards/NonAuthenticatedGuard';
import EmptyLayout from '@/layouts/Empty';
import MainLayout from '@/layouts/main';
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
      <NonAuthenticatedGuard>
        <EmptyLayout>
          <LoginPage />
        </EmptyLayout>
      </NonAuthenticatedGuard>
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
      <AuthenticatedGuard>
        <MainLayout>
          <ModulePage />
        </MainLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/module/create',
    Component: () => (
      <AuthenticatedGuard>
        <MainLayout>
          <CreateModulePage />
        </MainLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/menu',
    Component: () => (
      <AuthenticatedGuard>
        <MainLayout>
          <MenuPage />
        </MainLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/menu/create',
    Component: () => (
      <AuthenticatedGuard>
        <MainLayout>
          <CreateMenuPage />
        </MainLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/view',
    Component: () => (
      <AuthenticatedGuard>
        <MainLayout>
          <ViewPage />
        </MainLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/view/create',
    Component: () => (
      <AuthenticatedGuard>
        <EmptyLayout>
          <CreateViewPage />
        </EmptyLayout>
      </AuthenticatedGuard>
    ),
  },
  {
    path: '/:id',
    Component: () => (
      <AuthenticatedGuard>
        <EmptyLayout>
          <MainPage />
        </EmptyLayout>
      </AuthenticatedGuard>
    ),
  },
]);

export default routes;
