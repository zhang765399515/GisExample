<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadEllipsoidElectricMaterialProperty } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        loadEllipsoidElectricMaterialProperty();
    },1000)
}) 

</script>

<template>
</template>