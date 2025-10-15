import { cocosPanelConfig, cocosPanel } from '@cocos-fe/vite-plugin-cocos-panel';
import vue from '@vitejs/plugin-vue';
import { nodeExternals } from 'rollup-plugin-node-externals';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    /**
     *  注意事项:
     *  你能发现我们在 dev 和 build 都是走的 vite build，只是通过 --mode development 来区分开发环境 https://cn.vitejs.dev/guide/env-and-mode.html
     *  因为我们每次构建都需要实际构建出 js 文件，供编辑器读取，所以不能用 vite 的 dev 模式 (它不会构建产物到 dist)
     */
    const isDev = mode === 'development';

    return {
        build: {
            lib: {
                entry: {
                    browser: './src/browser/index.ts',
                    assetsMenu: './src/assets-menu/index.ts',
                    excelPanel: './src/panels/excelPanel/excelPanel.ts',
                    mvvmPanel: './src/panels/mvvmPanel/mvvmPanel.ts',
                },
                formats: ['cjs'],
                fileName: (_, entryName) => `${entryName}.cjs`,
            },
            watch: isDev
                ? {
                      include: ['./src/**/*.ts', './src/**/*.vue', './src/**/*.css'],
                  }
                : null,
            target: 'modules',
            minify: false,
            sourcemap: isDev
                ? process.platform === 'win32'
                    ? 'inline'
                    : true // windows 下 sourcemap 只有 inline 模式才会生效
                : false,
        },
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag.startsWith('ui-'),
                    },
                },
            }),
            nodeExternals({
                builtins: true, // 排除 node 的内置模块
                deps: false, // 将依赖打入 dist，发布的时候可以删除 node_modules
                devDeps: true,
                peerDeps: true,
                optDeps: true,
            }),
            cocosPanelConfig(),
            cocosPanel({
                transform: (css: string) => {
                    // element-plus 的全局变量是作用在 :root , 需要改成 :host
                    // 黑暗模式它是在 html 添加 dark 类名，我们应该在最外层的 #app 添加 class="dark"
                    return css.replace(/:root|html\.dark/g, (match) => {
                        return match === ':root' ? ':host' : '#app.dark';
                    });
                },
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    };
});
