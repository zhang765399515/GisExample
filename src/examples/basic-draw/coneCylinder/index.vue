<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { createConeCylinder } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        const cylinder = createConeCylinder({
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            bottomRadius: 30,
            length:50,
            color:'#ff0000'
        })
    },1000)
}) 

</script>

<template>
</template>