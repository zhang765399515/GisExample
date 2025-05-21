<script setup lang='ts'>
import { onMounted } from 'vue'
import { loadURLTemplate, loadArcGisMapServer, loadWebMapService, loadWebMapTileService } from './map'

</script>

<template>
    <div style="position: absolute; left: 100px; top:50px">
        <el-button type="primary" size="small" @click="loadURLTemplate">URLTemplate</el-button>
        <el-button type="primary" size="small" @click="loadArcGisMapServer">ArcGis</el-button>
        <el-button type="primary" size="small" @click="loadWebMapService">WMS</el-button>
        <el-button type="primary" size="small" @click="loadWebMapTileService">WMTS</el-button>
    </div>
</template>

<style lang='' scoped></style>