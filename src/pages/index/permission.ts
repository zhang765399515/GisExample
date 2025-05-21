import { NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded, Router } from 'vue-router';
import router from "@/router";
import { getToken } from '@/utils/auth'
import store from '@/store';

const whiteList = ['/login', '/404']

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
    const token = getToken(); // 自定义函数，检查用户是否已登录
    if (token) {
        if (whiteList.indexOf(to.path) !== -1) {
            next('/home')
        } else {
            store.user.getUserInfor().then(() => {
                next()
            })
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next("/login");
        }
    }
});
