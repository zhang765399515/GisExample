<script setup lang='ts'>
import {
    widgetsYanmo,
} from './map';

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="widgetsYanmo">可视域分析</el-button>
    </div>
</template>