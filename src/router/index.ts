import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import routers from './route';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '案例列表',
    redirect: '/home',
    children: []
  },
  {
    path: '/home',
    name: '案例列表',
    component: () => import('@/views/index.vue'),
    children: []
  },
  {
    path: '/example',
    name: '案例主路由',
    component: () => import('@/views/example.vue'),
  }, 
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login.vue'),
  },
  ...routers
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;
