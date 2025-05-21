<script setup lang="ts">
import { load3DTileset, drawPolygon } from "./map";
</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="load3DTileset">加载倾斜摄影模型</el-button>
            <el-button type="primary" size="small" @click="drawPolygon">测试DrawCommand绘制</el-button>
            <el-button type="primary" size="small" @click="drawPolygon">绘制裁剪平面</el-button>
        </div>
    </div>
</template>