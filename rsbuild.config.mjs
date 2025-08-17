import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Dotenv from 'dotenv-webpack';
import path from 'path';

export default defineConfig({
  build: {
    lib: [
      {
        entry: {
          index: path.resolve(__dirname, 'src/index.jsx'), // entry utama
          button: path.resolve(__dirname, 'src/components/button/Group.jsx'),
        },
        format: ['esm', 'cjs'],
      },
    ],
    outDir: 'dist',
  },
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
