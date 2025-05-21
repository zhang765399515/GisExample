import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from "@/utils/auth"
import { login, getUser } from "@/api/login";
import { rsa } from "@/utils/utils"
import cloneDeep from "lodash/cloneDeep";

export const user = defineStore('user', {
    state: () => {
        return {
            token: getToken(),
            name: '',
            userId: 0,
            userName: "",
        }
    },
    actions: {
        login(data: any) {
            return new Promise(async (resolve: any, reject: any) => {
                let list = cloneDeep(data);
                let request: any = await rsa(list.password);
                let { rsaPassWord, randomStr } = request;
                list.password = rsaPassWord;
                login({
                    ...list,
                    randomStr: randomStr,
                }).then((res: any) => {
                    setToken(res.access_token)
                    this.token = res.access_token;
                    resolve();
                })
            })
        },
        getUserInfor() {
            return new Promise(async (resolve: any, reject: any) => {
                getUser().then((res: any) => {
                    this.name = res.data.userAuthentication.principal.name;
                    this.userName = res.data.userAuthentication.principal.username;
                    this.userId = res.data.userAuthentication.principal.id;
                    resolve();
                })
            })
        },
        removeUser() {
            return new Promise(async (resolve: any, reject: any) => {
                this.token = "";
                this.name = "";
                this.userName = "";
                this.userId = 0;
                removeToken();
                resolve();
            })
        }
    },
    getters: {

    },
})