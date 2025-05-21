<script setup lang='ts'>
import { loadSceneLayerCloud } from './map'
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadSceneLayerCloud">加载点云数据</el-button>
    </div>
</template>