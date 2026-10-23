import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig(({ envMode, command }) => {
  // Loads .env, .env.local, .env.<mode> and .env.<mode>.local (later files win, shell variables
  // win over all). The mode is --env-mode, else development for `dev` and production otherwise.
  const { publicVars } = loadEnv({
    mode: envMode || (command === 'dev' ? 'development' : 'production'),
    prefixes: ['REACT_APP_'],
  });

  return {
    html: {
      favicon: './public/favicon.ico',
    },
    plugins: [pluginReact()],
    source: {
      define: publicVars,
    },
    resolve: {
      alias: {
        '@': './src',
        '@configs': './src/configs',
      },
    },
  };
});
