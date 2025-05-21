<script setup lang='ts'>
import {
    loadCylinderGeometry,
    loadCylinderGeometry2,
    loadDrill
} from './map';

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadDrill">自定义贴图孔</el-button>
    </div>
</template>
<style>
</style>