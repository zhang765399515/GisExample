<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { createRotateCylinder,setGraphicsRotate } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        const cylinder = createRotateCylinder({
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            topRadius: 30,
            bottomRadius: 30,
            length:50
        })
        setGraphicsRotate({
            entity: cylinder,
            position: { lng: 113.958782, lat: 22.540359, alt: 20 },
            rotateAmount: 2,//速度
        })
    },1000)
}) 

</script>

<template>
</template>