<script setup lang="ts">
import { reactive } from 'vue';
import { load,  flyTo } from './map';
const potion = {
  lon: 114.015783,
  lat: 22.583458
};
setTimeout(() => {
    load();
  flyTo(potion.lon, potion.lat);

}, 1000);
</script>

<template>
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
