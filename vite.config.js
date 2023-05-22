import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 入口文件
  build: {
    html:'/index.html'
  },
  // 手动指定预先绑定的依赖项
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [react()]
})
