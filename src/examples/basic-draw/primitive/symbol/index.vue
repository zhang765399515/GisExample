<script setup lang='ts'>
import { drawAny, drawCircular, clearAllDraw } from './map'

const startDraw = () => {
    drawAny()
}

const circular = (type: string) => {
    drawCircular(type)
}

const clearDraw = () => {
    clearAllDraw()
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button start-btn" @click="startDraw">开始绘制任意形状</el-button>
        <el-button type="primary" class="dhy_control-button start-btn1" @click="circular('circular')">开始绘制圆形</el-button>
        <el-button type="primary" class="dhy_control-button clear-btn" @click="clearDraw()">清除</el-button>
    </div>
</template>