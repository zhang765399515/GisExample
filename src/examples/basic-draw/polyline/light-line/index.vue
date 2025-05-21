<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadLayer,loadLine } from "./map"
import gzData from "@/assets/data/gz_area.json"

onMounted(() =>{
    setTimeout(()=>{
        loadLine();
    },1000)
}) 

</script>

<template>
</template>