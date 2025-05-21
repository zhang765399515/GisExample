<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { load } from "./map"

onMounted(() =>{
    setTimeout(() => {
        load();
    }, 1000);
}) 

</script>

<template>
</template>