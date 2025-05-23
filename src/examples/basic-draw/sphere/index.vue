<template>
  <div class="drill">
    <div><el-button type="primary" @click="sphereFun">加载球</el-button></div>
  </div>
</template>

<script setup>
import { loadSphere, loadShp2 } from './map';
const sphereFun = () => {
  loadSphere();
  // loadShp2()
};
setTimeout(() => {
    loadSphere();
    window.viewer.camera.flyTo({
    "destination": {
        "x": -2414688.2326425975,
        "y": 5369670.080407019,
        "z": 2445108.2625677646
    },
    "orientation": {
        "heading": 6.190514124887498,
        "pitch": -0.2509403808578883,
        "roll": 0.000004111502825310254
    },
    "duration": 1
},2000);
 
})
</script>

<style lang="scss" scoped>
.drill {
  position: fixed;
  top: 80px;
  left: 10px;
  > div {
    margin-top: 5px;
    .el-button {
      width: 120px;
    }
  }
}
</style>
