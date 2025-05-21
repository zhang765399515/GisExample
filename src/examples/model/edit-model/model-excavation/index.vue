<script lang="ts" setup>
import { load3dtiles, crop, cancel } from './map';
setTimeout(() => {
  console.log(123)
  load3dtiles();
}, 1000);
let startFun = () => {
  crop();
};
let cancelFun = () => {
  cancel();
};
</script>
<template>
  <div class="dhy_widget-main">
    <div class="virtual-borehole">
      <el-button type="primary" size="small" @click="startFun()">开挖</el-button>
      <el-button type="primary" size="small" @click="cancelFun()">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.virtual-borehole {
  width: 100%;
}
</style>
