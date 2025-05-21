import { defineAsyncComponent } from 'vue'
import { RouteRecordRaw } from "vue-router"
import routesData from './aside.json'
import systemRoutes from './system'
import personalRoutes from './personal'
import apihomeRoutes from './apihome'

// 加载vue组件
const layoutModules = import.meta.glob('/src/**/**/*.vue');

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  const component = layoutModules[`/src/${path}`];
  if (!component) {
  }
  return component;
};

const mastRouterArr: RouteRecordRaw[] = []

function getComponent(routes: any) {
  routes.map((route: any) => {
    if (route.path && route.url) {
      mastRouterArr.push({
        path: route.path,
        name: route.name,
        component: getDynamicComponent(route.url)
      })
    }
    if (route.children && route.children.length) {
      getComponent(route.children)
    }
  })
}

getComponent(routesData)
mastRouterArr.push(systemRoutes)
mastRouterArr.push(personalRoutes)
mastRouterArr.push(apihomeRoutes)
const routers: RouteRecordRaw[] = mastRouterArr

export default routers

