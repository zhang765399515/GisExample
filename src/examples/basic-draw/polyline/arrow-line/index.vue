<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadLayer,loadDynamicLine } from "./map"
import gzData from "@/assets/data/gz_area.json"

onMounted(() =>{
    setTimeout(()=>{
        loadDynamicLine();
    },1000)
}) 

</script>

<template>
</template>