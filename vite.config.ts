import react from '@vitejs/plugin-react-swc';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import electron from 'vite-plugin-electron/simple';
import svgr from 'vite-plugin-svgr';
import pkg from './package.json';

const routerBase = `/sub/`;

export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  rmSync('dist-electron', { recursive: true, force: true });
  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  // 获取`.env`环境配置文件
  const env = loadEnv(mode, process.cwd());
  const mockProxy: Required<UserConfig>['server']['proxy'] = {
    '/api/': {
      target: `http://0.0.0.0:${env.VITE_MOCK_APP_PORT}`,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  };
  const noMockProxy: Required<UserConfig>['server']['proxy'] = {
    '/api/': {
      // 后端服务地址
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  };
  const proxy: Required<UserConfig>['server']['proxy'] =
    env.VITE_HTTP_MOCK_ENV === 'true' ? mockProxy : noMockProxy;

  return {
    base: routerBase,
    plugins: [
      react(),
      svgr(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App',
              );
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: undefined,
      }),
      // 在浏览器中直接看到上报的类型错误（更严格的类型校验）
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx,cjs,mjs}"',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
        //scss: {},
      },
    },
    build: {
      target: 'esnext', // 最低 es2015/es6
      outDir: env.VITE_OUT_DIR || 'dist',
      // 单个 chunk 文件的大小超过 2000kB 时发出警告（默认：超过500kb警告）
      chunkSizeWarningLimit: 2000,
      manifest: true,
      rollupOptions: {
        // 分包
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js', // chunk包输出的文件夹名称
          entryFileNames: 'assets/js/entry-[name]-[hash].js', // 入口文件输出的文件夹名称
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]', // 静态文件输出的文件夹名称
        },
      },
    },
    // 预构建的依赖项，优化开发（该优化器仅在开发环境中使用）
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        'zustand',
        'classnames',
        'immer',
      ],
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      strictPort: true,
      proxy: proxy,
    },
  };
});
