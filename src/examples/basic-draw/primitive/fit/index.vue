<script lang="ts" setup>
import { drawFltPolygon } from './map'

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="drawFltPolygon">绘制贴于倾斜摄影的面</el-button>
    </div>
</template>