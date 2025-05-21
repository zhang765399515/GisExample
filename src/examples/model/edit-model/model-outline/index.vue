<template>
</template>

<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { modelOutLine } from './map'
    onMounted(()=>{
        setTimeout(() => { 
        modelOutLine();
        }, 1000)
    })
</script>