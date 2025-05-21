import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import geokeygis from 'vite-plugin-geokey-gis';
import copyPlugin from 'rollup-plugin-copy';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import AutoImport from 'unplugin-auto-import/vite';
import { getRootPath, getSrcPath } from './build';

const rootPath = getRootPath();
const srcPath = getSrcPath();
// const api = "http://192.168.1.105:8083";//本地
const api = "http://gis.igeokey.com:12025";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath
      }
    },
    define: {
      'process.env': {
        mode: mode,
        BASE_URL: viteEnv.VITE_BASE_URL,
        EDITOR_MODE: viteEnv.VITE_EDITOR_MODE !== '0',
        EXAMPLE_SOURCE_PATH: viteEnv.VITE_EXAMPLE_SOURCE_PATH
      },
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      manifest: false,
      minify: 'terser',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          editor: path.resolve(__dirname, 'editor.html')
        },
        inputType: 'esm'
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    plugins: [
      vue(),
      geokeygis(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'vuex', '@vueuse/core'],
        // 生成路径
        dts: path.resolve(srcPath, 'auto-imports.d.ts')
      }),
      copyPlugin({
        hook: 'closeBundle',
        targets: [
          {
            src: 'src/examples/**/*.*',
            dest: 'dist/examples',
            rename: (_name, _extension, fullPath) => {
              return fullPath.split('examples')[1];
            }
          }
        ]
      }),
      (monacoEditorPlugin as any).default({ publicPath: 'examples/assets-monaco' }),
    ],
    server: {
      watch: { usePolling: true },
      open: false,
      hmr: true,
      /* 设置为0.0.0.0则所有的地址均能访问 */
      host: '0.0.0.0',
      port: 8080,
      https: false,
      proxy: {
        [viteEnv.VITE_BASE_API]: {
          target: `${api}/`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/file': {
          target: `http://192.168.1.105:8083/`,
          changeOrigin: true,
          pathRewrite: { '^/file': '' }
        },
      }
    },
    optimizeDeps: {
      include: [
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/language/css/css.worker`,
        `monaco-editor/esm/vs/language/html/html.worker`,
        `monaco-editor/esm/vs/language/typescript/ts.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`
      ],
      esbuildOptions: {
        target: 'esnext'
      }
    }
  };
});
