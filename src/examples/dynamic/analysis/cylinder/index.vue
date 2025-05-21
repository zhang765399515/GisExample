<script setup lang='ts'>
import {
    loadStereoscopicWall,
} from './map';

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadStereoscopicWall">创建渐变钻孔</el-button>
    </div>
</template>