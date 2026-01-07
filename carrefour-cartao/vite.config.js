import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Permite acesso de outros dispositivos na rede
    strictPort: false, // Tenta a próxima porta se 5173 estiver ocupada
    open: false, // Não abre o navegador automaticamente (melhor para Windows)
    proxy: {
      // Proxy para API de CPF (contorna CORS)
      '/api/cpf': {
        target: 'https://aprovedireto.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cpf/, '/getCpfDataMagma.php'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adicionar headers necessários
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
      // Proxy para API VennoxPay (contorna CORS)
      '/api/vennox': {
        target: 'https://api.vennoxpay.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vennox/, '/functions/v1'),
        secure: true,
      },
      // Proxy para Backend Local (Analytics/Orders)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Garantir compatibilidade com Windows
  optimizeDeps: {
    exclude: [],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Melhorar compatibilidade Windows
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})

