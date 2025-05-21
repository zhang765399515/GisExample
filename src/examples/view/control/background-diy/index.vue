<template>
    <div class="dhy_widget-main">
        <el-button type="" @click="backGroundImgFun">显示背景</el-button>
    </div>
</template>

<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { backGroundImg } from './map'
    const backGroundImgFun = () =>{
            backGroundImg();

    }
</script>
<style lang="scss">
    .dhy_base-map{
        background: url('@/assets/images/backGroundImg.jpg') no-repeat;
        background-size: 100% 100%
    }
</style>