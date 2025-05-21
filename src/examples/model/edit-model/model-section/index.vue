<script setup lang='ts'>
import {loadSection,loadBackground} from './map';

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="section">
        <el-button type="primary" size="small" @click="loadSection">加载剖切面</el-button>
        <el-button type="primary" size="small" @click="loadBackground">颜色</el-button>
    </div>
</template>
<style lang="scss" scoped>
    .section{
        position: fixed;
        top: 80px;
        right: 200px;
    }
</style>