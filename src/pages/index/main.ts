import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { registerStore } from '@/store';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from "@/router";
import './permission' // permission control

import '@/styles/scss/global.scss';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from "mitt"

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const emitter = mitt();
declare module 'vue' {
    export interface ComponentCustomProperties {
        $Bus: typeof emitter
    }
}

app.config.globalProperties.$Bus = emitter;

app.use(createPinia());

registerStore();

app.use(ElementPlus)
app.use(router)
app.mount('#app')
