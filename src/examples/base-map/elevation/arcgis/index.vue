<script setup lang='ts'>
import { loadArcGISLayer } from './map'

const openSplitSlider = () => {
    loadArcGISLayer()
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button @click="openSplitSlider">加载Arcgis高程</el-button>
    </div>
</template>