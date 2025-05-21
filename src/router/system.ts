export default {
    path: "/system",
    name: "系统管理",
    component: () => import("@/views/system/index.vue"),
    redirect: "/system/menu",
    children:[
        {
            path: "menu",
            name: "菜单管理",
            url:"/system/menu",
            component: () => import("@/views/system/menu/index.vue"),
        },{
            path: "user",
            name: "用户管理",
            url:"/system/user",
            component: () => import("@/views/system/user/index.vue"),
        }
    ]
}