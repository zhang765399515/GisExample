<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { loadGlowingLine } from './map';

onMounted(() => {
  setTimeout(() => {
    loadGlowingLine();
    window.viewer.camera.flyTo({
      destination: {
        x: -2416863.697024666,
        y: 5413036.690415073,
        z: 2465775.7368041947
      },
      orientation: {
        heading: 6.283185307179585,
        pitch: -1.5707371750143295,
        roll: 0
      },
      duration: 1
    });
  }, 2000);
});
</script>

<template></template>
