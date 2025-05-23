<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadLayer,loadDynamicLine } from "./map"
import gzData from "@/assets/data/gz_area.json"

onMounted(() =>{
    setTimeout(()=>{
        loadDynamicLine();
        window.viewer.camera.flyTo({
    "destination": {
        "x": -2421498.6453485824,
        "y": 5426414.8486807095,
        "z": 2470286.5727127492
    },
    "orientation": {
        "heading": 0.0579201757565837,
        "pitch": -1.5578503929453364,
        "roll": 0
    },
    "duration": 1
});
    },2000)
}) 

</script>

<template>
</template>