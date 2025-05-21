<script setup lang='ts'>
import {
    loadHotMap,
} from './map';

</script>

<template>
    <!-- Entity方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadHotMap">加载热力图</el-button>
    </div>
</template>