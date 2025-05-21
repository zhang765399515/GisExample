<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { drewRadarScanning } from './map'

onMounted(()=>{
    setTimeout(()=>{
        const option = reactive({
            id: 'radarScanA',
            position: [113.958782,22.540359, 50],
            color: "rgb(255,0,0)",
            duration: 2000,
            radius: 1000,
            border: -1,
            width: 5
        })
        drewRadarScanning(option);
    },2000)
})
</script>

<template>
</template>

<style lang='' scoped></style>