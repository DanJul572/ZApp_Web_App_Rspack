import { createBrowserRouter } from 'react-router';
import AuthenticatedGuard from '@/guards/AuthenticatedGuard';
import NonAuthenticatedGuard from '@/guards/NonAuthenticatedGuard';
import EmptyLayout from '@/layouts/Empty';
import MainLayout from '@/layouts/main';
import WelcomePage from '@/pages';
import NotFoundPage from '@/pages/error/NotFoundPage';
import ServerErrorPage from '@/pages/error/ServerErrorPage';
import ContextContaner from '@/pages/layout';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import MenuPage from '@/pages/menu';
import CreateMenuPage from '@/pages/menu/create';
import ModulePage from '@/pages/module';
import CreateModulePage from '@/pages/module/create';
import RegisterPage from '@/pages/register';
import SettingPage from '@/pages/setting';
import UploadPage from '@/pages/upload';
import ViewPage from '@/pages/view';
import CreateViewPage from '@/pages/view/create';

const routes = createBrowserRouter([
  {
    element: <ContextContaner />,
    children: [
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
            <MainLayout>
              <MainPage />
            </MainLayout>
          </AuthenticatedGuard>
        ),
      },
      {
        path: '/setting',
        Component: () => (
          <AuthenticatedGuard>
            <MainLayout>
              <SettingPage />
            </MainLayout>
          </AuthenticatedGuard>
        ),
      },
      {
        path: '/upload',
        Component: () => (
          <AuthenticatedGuard>
            <MainLayout>
              <UploadPage />
            </MainLayout>
          </AuthenticatedGuard>
        ),
      },
      {
        path: '/not-found',
        Component: () => (
          <EmptyLayout>
            <NotFoundPage />
          </EmptyLayout>
        ),
      },
      {
        path: '/server-error',
        Component: () => (
          <EmptyLayout>
            <ServerErrorPage />
          </EmptyLayout>
        ),
      },
    ],
  },
]);

export default routes;
