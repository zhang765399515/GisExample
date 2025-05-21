<script setup lang='ts'>
import { ref, watch } from 'vue';
import { updateExaggeration, tileFlatten } from './map'


</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button size="small" @click="updateExaggeration">加载高程信息</el-button>
        <el-button size="small" @click="tileFlatten">绘制压平面</el-button>
    </div>
</template>