import { deepClone } from '@/utils/utils'; // 深拷贝
import router from './index';
// 处理路由展示列表树形格式 (如果所有路由数据是在同一级，需要调用这个方法)
export const formatRouterTree = (data: any) => {
  let parents = data.filter((i: any) => i.pid === 0),
    children = data.filter((item: any) => item.pid !== 0);
  dataToTree(parents, children);
  function dataToTree(parents: any, children: any) {
    parents.map((p: any) => {
      children.map((c: any, i: any) => {
        let _c = deepClone(children);
        _c.splice(i, 1);
        dataToTree([c], _c);
        if (p.children) {
          p.children.push(c);
        } else {
          p.children = [c];
        }
      });
    });
  }
};

// vite中获取文件
const modules = import.meta.glob(['../views/*.vue', '../views/*/*.vue', '../views/*/*/*.vue', '../components/layout/index.vue']);

// 处理路由所需格式
export const generateRouter = (userRouters: any) => {
  let newRouter = null;
  if (userRouters)
    newRouter = userRouters.map((route: any) => {
      let routes: any = {
        path: route.pathUrl,
        name: route.name,
        // meta: i.meta,
        component: route.pathUrl === '/layout' ? modules[`../components/layout/index.vue`] : modules[`../views${route.pathUrl}/index.vue`]
      };
      if (route.children) {
        routes.children = generateRouter(route.children);
      }
      return routes;
    });
  return newRouter;
};

/**
 * 添加动态路由
 */
export function setAddRoute(routes: any) {
  if (routes && routes.length > 0)
    routes.forEach((route: any) => {
      const routeName = route.name;
      if (!router.hasRoute(routeName)) router.addRoute(route);
    });
}
