<script setup lang='ts'>
import { loadPGEarth3DTileset } from './map'
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadPGEarth3DTileset">加载地质模型</el-button>
    </div>
</template>