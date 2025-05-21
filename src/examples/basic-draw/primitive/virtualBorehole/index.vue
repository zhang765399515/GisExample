<script lang="ts" setup>
import { addVirtualBorehole,load3dtiles } from './map'
const tiles = load3dtiles()
const colorData = {
  0: "#bfccb8",
  1: "#aeb7a0",
  2: "#b7c1ac",
  3: "#d7d3b5",
  4: "#fdf8c1",
  5: "#fcf496",
  6: "#f9ea2f",
  7: "#ffec02",
  8: "#ffd600",
  9: "#d2b300",
  10: "#c80000",
  11: "#f38365",
  12: "#f38365",
  13: "#f38365",
  14: "#f38365",
  15: "#d4edee",
  16: "#d4edee",
  17: "#d4edee",
  18: "#d2d2d2",
  19: "#d2d2d2",
}
const VirtualBorehole = new addVirtualBorehole({
    colorData:colorData,
    name:'cs_virtualBorehole',
    isFlyTo:true,
    pointColor:'#ff0000'
});
const startFun = () => {
    VirtualBorehole.startCreate();
}
const clearFun = () => {
    VirtualBorehole.clear();
}
</script>

<template>
    <div class="dhy_widget-main">
        <div class="virtual-borehole">
            <div>虚拟钻孔：</div>
            <el-button type="primary" size="small" @click="startFun()">开始</el-button>
            <el-button type="primary" size="small" @click="clearFun()">清除</el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .virtual-borehole{
        width: 100%;
    }
</style>