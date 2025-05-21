<script setup lang='ts'>
import {
    loadFlights,
} from './map';

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadFlights">绘制echarts散点图</el-button>
    </div>
</template>