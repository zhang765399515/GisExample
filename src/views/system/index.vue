<script lang="ts" setup>
import systemMenu from '@/components/AsideBar/systemMenu.vue'
import Header from '@/components/Header/index.vue'
</script>

<template>
    <div class="dhy_common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-container>
                <el-aside width="300px">
                    <systemMenu />
                </el-aside>
                <el-container>
                    <el-main>
                        <div class="dhy_cases">
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
