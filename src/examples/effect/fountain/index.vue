<script setup lang="ts">
import { createParticleSystem, removeFire } from './map';
setTimeout(() => {
    createParticleSystem()
  window.viewer.camera.flyTo({
    "destination": {
        "x": -2402181.7720780186,
        "y": 5380236.622400525,
        "z": 2437370.366080612
    },
    "orientation": {
        "heading": 0.7088178819032915,
        "pitch": -0.7125568581384214,
        "roll": 0.00023491227961702776
    },
    "duration": 1
});
}, 2000);
</script>

<template>
  <div class="dhy_widget-main">
    <el-button type="primary" @click="createParticleSystem">开启喷泉</el-button>
    <el-button type="primary" @click="removeFire">关闭喷泉</el-button>
  </div>
</template>
