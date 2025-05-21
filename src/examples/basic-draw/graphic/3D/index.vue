<script setup lang='ts'>
import {
    loadGraphics3D
} from './map'

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="loadGraphics3D">绘制三维图形</el-button>
    </div>
</template>