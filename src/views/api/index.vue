<script lang="ts" setup>
import { reactive } from 'vue'
import Header from '@/components/Header/index.vue'
import menuData from './muen.json'
let apiConten = reactive({listObj:[] as any});
apiConten.listObj = menuData[0];
const apiMenuFn = (item:object) => {
    apiConten.listObj = item;
}
</script>

<template>
    <div class="dhy_common-layout">
        <el-container class="dhy_common_style">
            <el-header>
                <Header />
            </el-header>
            <div class="api-home">
                <div class="api-home-ul">
                    <el-scrollbar>
                        <el-menu>
                            <el-menu-item v-for="(item,index) in menuData" v-bind:key="index" @click="apiMenuFn(item)">
                                <span>{{ item.name }}</span>
                            </el-menu-item>
                        </el-menu>
                    </el-scrollbar>
                </div>
                <div class="dhy_cases">
                    <el-scrollbar>
                        <h1>{{ apiConten.listObj.name }}</h1>
                        <div class="api-function"><span>作用：</span>{{ apiConten.listObj.functionDescription }}</div>
                        <div class="api-table">
                            <span>参数：</span>
                            <table>
                                <tr>
                                    <th>名称</th>
                                    <th>类型</th>
                                    <th>作用</th>
                                </tr>
                                <tr v-for="(item,index) in apiConten.listObj.parameter" v-bind:key="index">
                                    <td>{{ item.a }}</td>
                                    <td>{{ item.type }}</td>
                                    <td>{{ item.parameterDescription }}</td>
                                </tr>
                            </table>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </el-container>
    </div>
</template>
<style lang="scss" scoped>
.dhy_common_style{
    width: 100%;
    height: 100%;
}
.api-home{
    width: 100%;
    overflow: hidden;
   .api-home-ul{
        display: inline-block;
        width: 300px;
        height: calc(100vh - 70px);
        overflow: auto;
        .el-menu{
            background: transparent;
            border: none;
            .el-menu-item{
                height: 40px;
            }
        }
   }
   .dhy_cases {
        width: calc(100% - 310px);
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 1rem;
        background-color: #ffffffe6;
        padding: 0 10px;
        display: inline-block;
        .api-function{
            >span{
                display: inline-block;
                width: 50px;
            }
            margin-bottom: 10px;
        }
        .api-table{
            width: 100%;
            >span{
                vertical-align: top;
                display: inline-block;
                width: 50px;
            }
            >table{
                display: inline-block;
                width: calc(100% - 50px);
                border-collapse: collapse;
                tr{
                    width: 100%;
                    min-height: 30px;
                }
                td:nth-child(1),
                th:nth-child(1){
                    width: 300px;
                }
                td:nth-child(2),
                th:nth-child(2){
                    width: 200px;
                }
                td:nth-child(3),
                th:nth-child(3){
                    min-width: 500px;
                }
                tr,td,th{
                    border: 1px solid #aaa;
                    padding: 5px;
                }
            }
        }
    }
}
</style>