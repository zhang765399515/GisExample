<script setup lang='ts'>
import {
    loadPolylineGraphics
} from './map'

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="loadPolylineGraphics">绘制三维线</el-button>
    </div>
</template>