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

    },1000)
}) 

</script>

<template>
</template>