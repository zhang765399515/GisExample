<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { createModel,setGraphicsRotate,setGraphicsFloat } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        const model = createModel({
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            scale: 0.5,
            url:'glb/mx_yhd_nsl1/fbxToGlth.gltf'  
        });
        setGraphicsRotate({
            entity: model,
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            rotateAmount: 2,//速度
        })
        setGraphicsFloat({
            entity: model,
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            maxHeight: 20,
            speed: 0.2,
        })
        window.viewer.camera.flyTo({
    "destination": {
        "x": -2393479.6132583045,
        "y": 5386059.643131391,
        "z": 2429800.107612168
    },
    "orientation": {
        "heading": 5.12841546697246,
        "pitch": -0.7746269803861789,
        "roll": 6.283142894674741
    },
    "duration": 1
});

    },1000)
}) 

</script>

<template>
</template>