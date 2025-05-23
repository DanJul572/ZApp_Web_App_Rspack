import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Dotenv from 'dotenv-webpack';

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new Dotenv()],
    },
  },
  source: {
    alias: {
      '@': './src',
    },
  },
});
