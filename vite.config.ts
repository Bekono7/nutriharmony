import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    port: 8080,
    host: '0.0.0.0',
    open: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path: string) => path.replace(/^\/api/, '/api')
      }
    }
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      // Fix pour les modules CommonJS
      { find: /^~(.+)/, replacement: '$1' }
    ]
  },
  build: {
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor_react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor_radix';
            }
            return 'vendor';
          }
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ],
    exclude: ['js-big-decimal']
  },
  define: {
    'process.env': {}
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
