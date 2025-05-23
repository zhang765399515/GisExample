<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { loadLayer, loadLine } from './map';
import gzData from '@/assets/data/gz_area.json';

onMounted(() => {
  setTimeout(() => {
    loadLine();
    window.viewer.camera.flyTo({
      destination: {
        x: -2434962.3652263186,
        y: 5402102.746717299,
        z: 2418506.6113997726
      },
      orientation: {
        heading: 5.375900577407391,
        pitch: -0.544909383534232,
        roll: 0.000009986535319583822
      },
      duration: 1
    });
  }, 2000);
});
</script>

<template></template>
