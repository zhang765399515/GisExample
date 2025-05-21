<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadLayer,loadDynamicLine } from "./map"
import gzData from "@/assets/data/gz_area.json"

onMounted(() =>{
    setTimeout(()=>{
        loadLayer();
        gzData.geometries.forEach(e =>{
            let coordinates = e.coordinates;
            coordinates.forEach(list =>{
                let pointData = [];
                list.forEach(point =>{
                    pointData = [...pointData,...point]
                })
                loadDynamicLine(pointData);

            })
        })
    },1000)
}) 

</script>

<template>
</template>