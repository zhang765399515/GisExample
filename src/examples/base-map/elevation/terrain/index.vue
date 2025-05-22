<script setup lang="ts">
import { loadTerrainLayer } from './map';
setTimeout(() => {
  window.viewer.camera.flyTo({
    destination: {
      x: -2415274.2285898174,
      y: 5387712.729459213,
      z: 2410122.5128152315
    },
    orientation: {
      heading: 6.02734324213137,
      pitch: -0.213930790079353,
      roll: 6.282988956309356
    },
    duration: 1
  });
  loadTerrainLayer();
}, 2000);
const openSplitSlider = () => {
  loadTerrainLayer();
};
</script>

<template>
  <!-- primitive方式绘制基础点线面圆对象 -->
  <div class="dhy_widget-main">
    <!-- <el-button @click="openSplitSlider">加载深圳高程</el-button> -->
  </div>
</template>
