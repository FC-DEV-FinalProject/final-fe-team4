import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // server: {
  //   proxy: {
  //     '/tts': {
  //       target: 'https://mock.popomance.kr',
  //       changeOrigin: true,
  //       secure: false, // HTTPS 설정 무시 (필요 시)
  //     },
  //   },
  // },
});
