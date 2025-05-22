import service from '@/utils/axios'
import getMenuJson from './getMenu.json'
// 菜单管理
// 新增目录
export function addMenu(data:any) {
    return service({
        url: "/case/cata/saveCata",
        method: "post",
        params:data,
    });
}
// 获取目录
export function getMenu(data:any) {
    // return service({
    //     url: "/case/cata/getLists",
    //     method: "post",
    //     params:data,
    // });
    return Promise.resolve(getMenuJson)
}
// 修改目录
export function modifyMenu(data:any) {
    return service({
        url: "/case/cata/upCata",
        method: "get",
        params:data,
    });
}
// 删除目录
export function deleteMenu(data:any) {
    return service({
        url: "/case/cata/delCata",
        method: "get",
        params:data,
    });
}
//文件上传
export function loadFile(data:any) {
    return service({
        url: "/case/common/upload",
        method: "post",
        data:data,
    });
}

// 用户管理
//新增用户
export function addUser(data:any) {
    return service({
        url: "/case/user/add",
        method: "post",
        params:data,
    });
}
//获取用户
export function getUserList(data:any) {
    return service({
        url: "/case/user/list",
        method: "post",
        params:data,
    });
}
export function getUser() {
    return service({
        url: "/case/user/getUser",
        method: "get",
    });
}

export function delUser(data:any) {
    return service({
        url: "/case/user/delete",
        method: "post",
        params:data,
    });
}
export function modifyUser(data:any) {
    return service({
        url: "/case/user/update",
        method: "post",
        params:data,
    });
}
export function updatePassword(data:any) {
    return service({
        url: "/case/user/updatePassword",
        method: "post",
        params:data,
    });
}

