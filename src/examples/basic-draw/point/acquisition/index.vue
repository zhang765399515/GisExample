<script setup lang='ts'>
import { ellipseGather, rectangularGather, rightAngleArrow } from './map'

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="ellipseGather">圆采集</el-button>
        <el-button type="primary" class="dhy_control-button" @click="rectangularGather">矩形采集</el-button>
        <el-button type="primary" class="dhy_control-button" @click="rightAngleArrow">直线箭头采集</el-button>
    </div>
</template>