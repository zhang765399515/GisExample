<script setup lang='ts'>
import {
    loadPolygonGraphics
} from './map'

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="loadPolygonGraphics">绘制三维面</el-button>
    </div>
</template>