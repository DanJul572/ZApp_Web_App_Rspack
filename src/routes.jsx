import { createBrowserRouter } from 'react-router';
import AuthContainer from '@/guards/AuthContainer';
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
      <AuthContainer>
        <EmptyLayout>
          <LoginPage />
        </EmptyLayout>
      </AuthContainer>
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
      <AuthContainer>
        <MainLayout>
          <ModulePage />
        </MainLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/module/create',
    Component: () => (
      <AuthContainer>
        <MainLayout>
          <CreateModulePage />
        </MainLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/menu',
    Component: () => (
      <AuthContainer>
        <MainLayout>
          <MenuPage />
        </MainLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/menu/create',
    Component: () => (
      <AuthContainer>
        <MainLayout>
          <CreateMenuPage />
        </MainLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/view',
    Component: () => (
      <AuthContainer>
        <MainLayout>
          <ViewPage />
        </MainLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/view/create',
    Component: () => (
      <AuthContainer>
        <EmptyLayout>
          <CreateViewPage />
        </EmptyLayout>
      </AuthContainer>
    ),
  },
  {
    path: '/:id',
    Component: () => (
      <AuthContainer>
        <EmptyLayout>
          <MainPage />
        </EmptyLayout>
      </AuthContainer>
    ),
  },
]);

export default routes;
