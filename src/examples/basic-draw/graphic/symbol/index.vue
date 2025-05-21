<script setup lang='ts'>
import { loadGraphicsBasic } from './map'

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="loadGraphicsBasic">点</el-button>
        <el-button type="primary" class="dhy_control-button">线</el-button>
        <el-button type="primary" class="dhy_control-button">面</el-button>
        <el-button type="primary" class="dhy_control-button">文字</el-button>
        <el-button type="primary" class="dhy_control-button">图标</el-button>
    </div>
</template>