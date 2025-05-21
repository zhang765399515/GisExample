export default {
    path: "/personal",
    name: "用户信息",
    component: () => import("@/views/personal/index.vue"),
    redirect: "/personal/information",
    children:[
        {
            path: "information",
            name: "个人中心",
            url:"/personal/information",
            component: () => import("@/views/personal/information/index.vue"),
        }
    ]
}