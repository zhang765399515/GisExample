<script setup lang="ts">
import { reactive } from 'vue';
import { loadTer, load, flyTo } from './map';

//数字类型贴地会偏移，等后续优化
const potion = {
  lon: 114.015783,
  lat: 22.583458
};
const loadPoint = () => {
  loadTer();
  load({
    centerPoint: {
      longitude: 114.015783,
      latitude: 22.583458
    },
    text: '1111',
    fontSize: 160,
    canvasStyle: {
      colorBG: '#00FF00'
    }
  });
  flyTo(potion.lon, potion.lat);
};
</script>

<template>
  <div class="dhy_widget-main">
    <el-button @click="loadPoint">新增点</el-button>
  </div>
</template>
<style lang="scss">
#myCanvas {
  min-width: 75px;
  max-width: 300px;
  height: 25px;
  display: none;
  background: url('/image/popbg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
