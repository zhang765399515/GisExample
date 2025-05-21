<script setup lang='ts'>
import { onMounted } from 'vue';
import {
    createInundationScene,
    drawInundationRange,
    inundationStart,
    inundationStop,
    removeInundationRange
} from './map';

onMounted(() => {
    setTimeout(() => {
        createInundationScene()
    }, 1000)
})

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="drawInundationRange">绘制范围</el-button>
        <el-button type="primary" size="small" @click="inundationStart">开始</el-button>
        <el-button type="primary" size="small" @click="inundationStop">停止</el-button>
        <el-button type="primary" size="small" @click="removeInundationRange">清除绘制范围</el-button>
    </div>
</template>