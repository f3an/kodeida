import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Відносні шляхи: Electron віддає збірку через протокол app://
  base: './',
  plugins: [react()],
  worker: { format: 'es' },
  build: { target: 'chrome140', chunkSizeWarningLimit: 8000 },
});
