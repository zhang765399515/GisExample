<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { createDynamicShadeWallGraphics } from "./map"
import nantouData from '@/assets/data/walljson/nantoustreet.json';

onMounted(() =>{
    const warpWallData: number[] = [];
    nantouData.forEach((item: string[]) => {
        warpWallData.push(+item[0], +item[1],200);
    });
    setTimeout(()=>{
        createDynamicShadeWallGraphics({
            positions: warpWallData,
            speed:0.01
        })
    },1000)
}) 

</script>

<template>
</template>