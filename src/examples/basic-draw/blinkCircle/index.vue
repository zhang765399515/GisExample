<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { createBlinkCircle } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        createBlinkCircle({
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            semiMinorAxis: 30,
            semiMajorAxis: 30,
            speed:0.01,
            color:'rgb(255,255,0)',
        })
    },1000)
}) 

</script>

<template>
</template>