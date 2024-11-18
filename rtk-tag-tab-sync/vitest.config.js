import path from 'path';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

export default {
  plugins: [tsconfigPaths(), react(), viteSingleFile()],
  test: {
    environment: 'jsdom',
    globals: {
      vitest: {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
