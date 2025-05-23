<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadEllipsoidElectricMaterialProperty } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        loadEllipsoidElectricMaterialProperty();
        window.viewer.camera.flyTo({
    "destination": {
        "x": -2390447.251827581,
        "y": 5388729.304557781,
        "z": 2428189.67283966
    },
    "orientation": {
        "heading": 0.15675316581309318,
        "pitch": -0.6822639313713186,
        "roll": 6.283182803010032
    },
    "duration": 1
});

    },1000)
}) 

</script>

<template>
</template>