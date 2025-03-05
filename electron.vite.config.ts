import type { ElectronViteConfig } from 'electron-vite';
import { defineConfig } from 'electron-vite';
import { resolve } from 'node:path';
import { mergeConfig } from 'vite';
import { getViteConfig } from './vite.config';

export default defineConfig((configEnv) => {
  const renderer: ElectronViteConfig['renderer'] = mergeConfig<
    Required<ElectronViteConfig>['renderer'],
    Required<ElectronViteConfig>['renderer']
  >(getViteConfig(configEnv), {
    root: '.',
    build: {
      target: 'chrome*',
      outDir: 'dist-electron/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
  });

  return {
    main: {
      build: {
        outDir: 'dist-electron/main',
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/main/index.ts'),
          },
        },
      },
    },
    preload: {
      build: {
        outDir: 'dist-electron/preload',
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/preload/index.ts'),
          },
          output: {
            format: 'cjs',
          },
        },
      },
    },
    renderer: {
      root: '.',
      ...renderer,
    },
  };
});
