<script setup lang='ts'>
import { reactive, render,createVNode,onMounted } from 'vue'
import {addMasker} from "./map"
const createMaskerFun = ()=>{
    addMasker()
}

setTimeout(() => {
    createMaskerFun()
    window.viewer.camera.flyTo({
    "destination": {
        "x": -1455534.3556571302,
        "y": 4842501.7641191045,
        "z": 3923494.888770141
    },
    "orientation": {
        "heading": 6.283185307179583,
        "pitch": -1.5707963267948966,
        "roll": 0
    },
    "duration": 1
});

}, 2000);
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="createMaskerFun">生成</el-button>
    </div>
</template>
<style lang="scss">


</style>