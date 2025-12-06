import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Dotenv from 'dotenv-webpack';

export default defineConfig({
  html: {
    favicon: './public/favicon.ico',
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new Dotenv()],
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@configs': './src/configs',
    },
  },
});
