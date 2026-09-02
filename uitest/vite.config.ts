import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const localEnv = loadEnv(mode, process.cwd(), '');
  const youtubeApiKey = localEnv.YOUTUBE_API_KEY || localEnv.VITE_YOUTUBE_API_KEY || rootEnv.YOUTUBE_API_KEY || rootEnv.VITE_YOUTUBE_API_KEY || '';

  return {
    envDir: path.resolve(__dirname, '..'),
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_YOUTUBE_API_KEY': JSON.stringify(youtubeApiKey),
      'process.env.YOUTUBE_API_KEY': JSON.stringify(youtubeApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
