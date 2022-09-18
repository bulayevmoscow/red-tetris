import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    checker({
      typescript: true,
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3003,
  },
});
