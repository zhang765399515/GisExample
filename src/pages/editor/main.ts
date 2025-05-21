import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { registerStore } from '@/store';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from "@/router";

import '@/styles/scss/global.scss';

const app = createApp(App);

app.use(createPinia());

registerStore();

app.use(ElementPlus)
app.use(router)
app.mount('#root')
