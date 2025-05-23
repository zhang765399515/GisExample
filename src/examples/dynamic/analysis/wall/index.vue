<script setup lang='ts'>
import {
    loadStereoscopicWall,
} from './map';
setTimeout(() => {
    loadStereoscopicWall()
},2000)
</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadStereoscopicWall">创建炫光立体墙</el-button>
    </div>
</template>