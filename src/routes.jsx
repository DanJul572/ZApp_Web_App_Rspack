import { createBrowserRouter } from 'react-router';

import EmptyLayout from '@/layout/Empty';
import LoginPage from '@/core/login/page';

const routes = createBrowserRouter([
  {
    path: '/login',
    Component: () => (
      <EmptyLayout>
        <LoginPage />
      </EmptyLayout>
    ),
  },
]);

export default routes;
