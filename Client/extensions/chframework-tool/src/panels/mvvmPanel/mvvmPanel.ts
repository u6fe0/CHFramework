import { createApp } from 'vue';

import './style.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { ElMessage } from 'element-plus';

import App from './App.vue';
import { state } from './pina';
import { keyAppRoot, keyMessage } from './provide-inject';

import type { MessageOptions } from 'element-plus';

const weakMap = new WeakMap();

export default Editor.Panel.define({
    template: '<div id="app" class="dark"></div>', // 只留一个 div 用于 vue 的挂载
    $: {
        root: '#app',
    },
    ready() {
        if (!this.$.root) return;

        const app = createApp(App);
        app.provide(keyAppRoot, this.$.root);
        app.provide(keyMessage, (options: MessageOptions = {}) => {
            if (typeof options === 'string') {
                options = { message: options };
            }
            options.appendTo ??= this.$.root as HTMLElement;
            return ElMessage(options);
        });
        app.mount(this.$.root);

        weakMap.set(this, app);
    },
    close() {
        const app = weakMap.get(this);
        app?.unmount?.();
    },
    methods: {
        increase() {
            state.a += 1;
        },
    },
});
