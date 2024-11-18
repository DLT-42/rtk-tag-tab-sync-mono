import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

import dts from 'vite-plugin-dts';
import * as packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    viteSingleFile(),
    dts({
      include: ['src/'],
    }),
  ],
  base: './',
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve('src', 'index.ts'),
      name: 'rtk-tag-tab-sync',
      formats: ['es', 'umd'],
      fileName: (format) => `${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
});
