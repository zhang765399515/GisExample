<script setup lang='ts'>
import { loadTerrainLayer } from './map'

const openSplitSlider = () => {
    loadTerrainLayer()
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button @click="openSplitSlider">加载深圳高程</el-button>
    </div>
</template>