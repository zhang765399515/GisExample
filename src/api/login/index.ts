
import service from '@/utils/axios'

// 分享获取服务地址
export function login(data: any) {
    return service({
        url: "/case/oauth/token",
        method: "get",
        params: data,
    });
}
export function getRSA(data: any) {
    return service({
        url: "/case/code/getkey1?randomStr=" + data,
        method: "get",
    });
}
export function getUser() {
    return service({
        url: "/case/user/getUser",
        method: "get",
    });
}
