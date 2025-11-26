import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import './style.css';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

import 'react-virtualized/styles.css';

import Layout from '@/pages/layout';
import { ConfigProvider } from './contexts/ConfigProvider';
import routes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider>
      <Layout>
        <RouterProvider router={routes} />
      </Layout>
    </ConfigProvider>
  </React.StrictMode>,
);
