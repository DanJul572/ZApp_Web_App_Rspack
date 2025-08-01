import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Dotenv from 'dotenv-webpack';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: process.env.APP_NAME,
  },
  tools: {
    rspack: {
      plugins: [new Dotenv()],
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
