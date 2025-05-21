<script lang="ts" setup>
// import { } from './map'

const startFun = () => {
}
const clearFun = () => {
}
</script>

<template>
    <div class="dhy_widget-main">
        <div class="virtual-borehole">
            <div>坡度坡向：</div>
            <el-button type="primary" size="small" @click="startFun()">开始</el-button>
            <el-button type="primary" size="small" @click="clearFun()">清除</el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .virtual-borehole{
        width: 100%;
    }
</style>