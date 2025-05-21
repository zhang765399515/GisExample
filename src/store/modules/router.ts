import { defineStore } from 'pinia'
import { generateRouter, setAddRoute } from '@/router/router'
export const routeStore = defineStore('route', {
  state: () => {
    return {
    }
  },
  actions: {
    addRouter() {
      // 生成路由树
      let find = JSON.parse(window.localStorage.getItem('routerList') as string)
      let routerList = generateRouter(find)
      // 添加路由
      setAddRoute(routerList)
    },
  },
  getters: {},
})