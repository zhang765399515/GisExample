<script setup lang='ts'>
import { loadExaggeration, tileExcavation } from './map'
</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button size="small" @click="loadExaggeration">加载高程信息</el-button>
        <el-button size="small" @click="tileExcavation">绘制开挖面</el-button>
    </div>
</template>