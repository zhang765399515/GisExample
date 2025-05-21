<script setup lang='ts'>
import { loadPGEarth3DTile } from './map'
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadPGEarth3DTile">加载管网模型</el-button>
    </div>
</template>