import axios from 'axios'
import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from "@/utils/auth"
import store from '@/store';

let isRelogin: boolean = false;

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 30000
})
/* 请求拦截器 */
service.interceptors.request.use((config: any) => {
    if (getToken()) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, (error: AxiosError) => {
    ElMessage.error(error)
    return Promise.reject(error)
})

/* 响应拦截器 */
service.interceptors.response.use((response: AxiosResponse) => {
    const { code, message, data } = response.data
    // 根据自定义错误码判断请求是否成功
    if (response.status === 200) {
        // 将组件用的数据返回
        return response.data
    } else {
        // 处理业务错误。
        ElMessage.error(message)
        return Promise.reject(new Error(message))
    }
}, (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = ''
    // HTTP 状态码
    const status = error.response?.status
    switch (status) {
        case 400:
            message = '用户名或密码错误'
            break;
        case 401:
            message = 'token 失效，请重新登录'
            if (!isRelogin) {
                isRelogin = true;
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
                    isRelogin = false;
                    store.user.removeUser().then(() => {
                        location.href = '/login';
                    })
                }).catch(() => {
                    isRelogin = false;
                });
            }
            // 这里可以触发退出的 action
            break;
        case 403:
            message = '拒绝访问'
            break;
        case 404:
            message = '请求地址错误'
            break;
        case 500:
            message = '服务器故障'
            break;
        default:
            message = '网络连接故障'
    }
    ElMessage.error(message)
    return Promise.reject(error)
})

export default service