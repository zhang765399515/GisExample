<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { craeteDynamicCricleGraphics } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        craeteDynamicCricleGraphics({
            center: { lng: 113.958782, lat: 22.540359, alt: 1 },
            radius: 800,
            scale: 1800,
        });
    },1000)
}) 

</script>

<template>
</template>