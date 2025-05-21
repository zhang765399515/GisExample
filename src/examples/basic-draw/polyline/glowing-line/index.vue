<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadGlowingLine } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        loadGlowingLine();
    },1000)
}) 

</script>

<template>
</template>