import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 또는 특정 디렉토리를 위한 별칭을 설정할 수도 있습니다.
      // '@components': path.resolve(__dirname, './src/components'),
      // '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
