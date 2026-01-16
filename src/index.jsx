import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import './style.css';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

import 'react-virtualized/styles.css';

import { ConfigProvider } from './contexts/ConfigProvider';
import routes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <RouterProvider router={routes} />
    </ConfigProvider>
  </React.StrictMode>,
);
